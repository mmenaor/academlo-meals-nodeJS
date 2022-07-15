//Models
const { User } = require('./user.model');
const { Meal } = require('./meal.model');
const { Order } = require('./order.model');
const { Restaurant } = require('./restaurant.model');
const { Review } = require('./review.model');

const initModels = () => {
    User.hasMany(Review, {foreignKey: 'userId'});
    Review.belongsTo(User);

    User.hasMany(Order, {foreignKey: 'userId'});
    Order.belongsTo(User);

    Restaurant.hasMany(Review, {foreignKey: 'restaurantId'});
    Review.belongsTo(Restaurant);

    Restaurant.hasMany(Meal, {foreignKey: 'restaurantId'});
    Meal.belongsTo(Restaurant);

    Meal.hasMany(Order, {foreignKey: 'mealId'});
    Order.belongsTo(Meal);
};

module.exports = { initModels }