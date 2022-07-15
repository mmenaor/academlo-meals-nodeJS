const express = require('express');

// Controllers
const { 
    createMeal,
    getAllMeals,
    getMealById,
    updateMeal,
    deleteMeal,
} = require('../controllers/meals.controller');

 //Middleware
const { mealExists } = require('../middlewares/meals.middleware');
const { restaurantExists } = require('../middlewares/restaurants.middleware');
const { protectSession, protectUserAccount, protectAdminActions } = require('../middlewares/auth.middleware');
const { createMealValidators } = require('../middlewares/validators.middleware');

// Define endpoints before activate server listening to requests
const mealsRouter = express.Router();

mealsRouter.get('/', getAllMeals);

mealsRouter.get('/:id', mealExists, getMealById);

mealsRouter.use(protectSession);

mealsRouter
    .use('/:id', protectAdminActions)
    .route('/:id')
    .post(createMealValidators, restaurantExists, createMeal)
    .patch(mealExists, updateMeal)
    .delete(mealExists, deleteMeal)

module.exports = { mealsRouter };