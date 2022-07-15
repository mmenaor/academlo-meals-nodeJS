const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

//Models
const { User } = require('../models/user.model');
const { Order } = require('../models/order.model');
const { Restaurant } = require('../models/restaurant.model');
const { Meal } = require('../models/meal.model');

//Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });

const createUser = catchAsync(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    //Hash password
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt); //salt 

    let newRole = role;

    if(!newRole){
        newRole = "normal";
    }

    const newUser = await User.create({ 
        name, 
        email, 
        password: hashPassword,
        role: newRole
    });

    //Remove password from response
    newUser.password = undefined;

    res.status(201).json({
        status: 'success',
        newUser
    });   
});

const updateUser = catchAsync(async (req, res, next) => {
    const { user } = req;
    const { name, email } = req.body;

    await user.update({ name, email });

    res.status(204).json({ status: 'success' });
});

const deleteUser = catchAsync(async (req, res, next) => {
    const { user } = req;

    await user.update({ status: 'deleted'});

    res.status(204).json({ status: 'success' });
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //Validate credentials (email)
    const user = await User.findOne({ where: { email, status: 'active' } });

    if(!user){
        return next(new AppError('Credentials invalid', 400));
    }

    //Validate password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if(!isValidPassword){
        return next(new AppError('Credentials invalid', 400));
    }

    //Generate JWT (Jason Web Token)
    //require('crypto').randomBytes(64).toString('hex')
    const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, { 
        expiresIn: '30d',
    });

    //Send response
    res.status(200).json({
        status: 'success',
        token,
    });
});

const getAllOrders = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
    
    const orders = await Order.findAll({ 
        where: { userId: sessionUser.id },
        include: [{ 
            model: Meal,
            include: [{ model: Restaurant }]
        }]
    });

    res.status(200).json({
        status: 'success',
        orders
    });    
});

const getOrderById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    
    const order = await Order.findOne({ 
        where: { id },
        include: [{ 
            model: Meal,
            include: [{ model: Restaurant }]
        }]
    });

    res.status(200).json({
        status: 'success',
        order
    });    
});

module.exports = { 
    createUser,
    login,
    updateUser, 
    deleteUser,
    getAllOrders,
    getOrderById
};