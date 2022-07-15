//Models
const { Restaurant } = require('../models/restaurant.model');
const { Review } = require('../models/review.model');

//Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const restaurantExists = catchAsync(async (req, res, next) => {
    const { id, restaurantId } = req.params;

    const restaurant = await Restaurant.findOne({ where: { id: id || restaurantId, status: "active" } });

    if (!restaurant){
        return next(new AppError('Restaurant not found', 404));
    }

    req.restaurant = restaurant;
    
    next();
});

const restaurantReviewExists = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const review = await Review.findOne({ where: { id } });

    if (!review){
        return next(new AppError('Review not found', 404));
    }

    req.review = review;
    
    next();  
});

module.exports = { restaurantExists, restaurantReviewExists };