//Models
const { Restaurant } = require('../models/restaurant.model');
const { Meal } = require('../models/meal.model');

//Utils
const { catchAsync } = require('../utils/catchAsync.util');

const createMeal = catchAsync(async (req, res, next) => {
    const { name, price } = req.body;
    const { restaurant } = req;

    const newMeal = await Meal.create({ 
        name,
        price,
        restaurantId: restaurant.id
    });

    res.status(201).json({
        status: 'success',
        newMeal
    });
});

const getAllMeals = catchAsync(async (req, res, next) => {    
    const meals = await Meal.findAll({ 
        where: { status: "active" },
        include: [{ model: Restaurant }]
    });

    res.status(200).json({
        status: 'success',
        meals
    });    
});

const getMealById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    
    const meal = await Meal.findOne({ 
        where: { id, status: "active" },
        include: [{ model: Restaurant }]
    });

    res.status(200).json({
        status: 'success',
        meal
    });    
});

const updateMeal = catchAsync(async (req, res, next) => {
    const { meal } = req;
    const { name, price } = req.body;

    await meal.update({ name, price });

    res.status(204).json({ status: 'success' });
});

const deleteMeal = catchAsync(async (req, res, next) => {
    const { meal } = req;

    await meal.update({ status: 'deleted'});

    res.status(204).json({ status: 'success' });
});

module.exports = { 
    createMeal,
    getAllMeals,
    getMealById,
    updateMeal,
    deleteMeal,
};