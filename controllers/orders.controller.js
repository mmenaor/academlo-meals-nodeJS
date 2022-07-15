//Models
const { Order } = require('../models/order.model');
const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');

//Utils
const { catchAsync } = require('../utils/catchAsync.util');

const createOrder = catchAsync(async (req, res, next) => {
    const { quantity, mealId } = req.body;
    const { sessionUser, meal } = req;

    const totalPrice = quantity * meal.price;

    const newOrder = await Order.create({ 
        mealId,
        userId: sessionUser.id,
        totalPrice,
        quantity
    });

    res.status(201).json({
        status: 'success',
        newOrder
    });
});

const getAllOrdersByUser = catchAsync(async (req, res, next) => {
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

const completeOrder = catchAsync(async (req, res, next) => {
    const { order, sessionUser } = req;

    if(sessionUser.id !== order.userId){
        return next(new AppError('You cannot make changes to this order', 400));
    }

    await order.update({ status: 'completed'});

    res.status(204).json({ status: 'success' });
});

const cancelOrder = catchAsync(async (req, res, next) => {
    const { order } = req;

    await order.update({ status: 'cancelled'});

    res.status(204).json({ status: 'success' });
});

module.exports = { 
    createOrder,
    getAllOrdersByUser,
    completeOrder,
    cancelOrder,
};