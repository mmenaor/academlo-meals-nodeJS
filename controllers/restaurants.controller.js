//Models
const { Restaurant } = require('../models/restaurant.model');
const { Review } = require('../models/review.model');

//Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const createRestaurant = catchAsync(async (req, res, next) => {
    const { name, address, rating } = req.body;

    const newRestaurant = await Restaurant.create({ 
        name, 
        address, 
        rating
    });

    res.status(201).json({
        status: 'success',
        newRestaurant
    });   
});

const getAllActiveRestaurants = catchAsync(async (req, res, next) => {    
    const restaurants = await Restaurant.findAll({ 
        where: { status: "active" },
        include: { model: Review }
    });

    res.status(200).json({
        status: 'success',
        restaurants
    });    
});

const getRestaurantById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    
    const restaurant = await Restaurant.findOne({ 
        where: { id },
        include: [{ model: Review }]
    });

    res.status(200).json({
        status: 'success',
        restaurant
    });    
});

const updateRestaurant = catchAsync(async (req, res, next) => {
    const { restaurant } = req;
    const { name, address } = req.body;

    await restaurant.update({ name, address });

    res.status(204).json({ status: 'success' });
});

const deleteRestaurant = catchAsync(async (req, res, next) => {
    const { restaurant } = req;

    await restaurant.update({ status: 'deleted'});

    res.status(204).json({ status: 'success' });
});

const reviewRestaurant = catchAsync(async (req, res, next) => {
    const { restaurant, sessionUser } = req;
    const { comment, rating } = req.body;

    const newReview = await Review.create({
        userId: sessionUser.id,
        comment,
        restaurantId: restaurant.id,
        rating
    })

    res.status(201).json({
        status: 'success',
        newReview
    });   
});

const updateReview = catchAsync(async (req,res,next) => {
    const { review, sessionUser } = req;
    const { comment, rating } = req.body;

    if(sessionUser.id !== review.userId){
        return next(new AppError('You cannot make changes to this review', 400));
    }

    await review.update({ comment, rating });

    res.status(204).json({ status: 'success' });
});

const deleteReview = catchAsync(async (req,res,next) => {
    const { review, sessionUser } = req;

    if(sessionUser.id !== review.userId){
        return next(new AppError('You cannot make changes to this review', 400));
    }

    await review.update({ status: 'deleted' });

    res.status(204).json({ status: 'success' });
});

module.exports = { 
    createRestaurant,
    getAllActiveRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
    reviewRestaurant,
    updateReview,
    deleteReview
};