const express = require('express');

// Controllers
const { 
    createRestaurant,
    getAllActiveRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
    reviewRestaurant,
    updateReview,
    deleteReview
} = require('../controllers/restaurants.controller');

 //Middleware
const { restaurantExists, restaurantReviewExists } = require('../middlewares/restaurants.middleware');
const { protectSession, protectAdminActions } = require('../middlewares/auth.middleware');
const { createRestaurantValidators } = require('../middlewares/validators.middleware');

// Define endpoints before activate server listening to requests
const restaurantsRouter = express.Router();

restaurantsRouter.get('/', getAllActiveRestaurants);

restaurantsRouter.get('/:id', restaurantExists, getRestaurantById);

restaurantsRouter.use(protectSession);

restaurantsRouter.post('/', createRestaurantValidators, protectAdminActions, createRestaurant);

restaurantsRouter.post('/reviews/:restaurantId', restaurantExists, reviewRestaurant);

restaurantsRouter
    .use('/reviews/:id', restaurantReviewExists)
    .route('/reviews/:id')
    .patch(updateReview)
    .delete(deleteReview)

restaurantsRouter
    .use('/:id', protectAdminActions, restaurantExists)
    .route('/:id')
    .patch(updateRestaurant)
    .delete(deleteRestaurant)

module.exports = { restaurantsRouter };