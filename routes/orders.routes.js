const express = require('express');

// Controllers
const { 
    createOrder,
    getAllOrdersByUser,
    completeOrder,
    cancelOrder,
} = require('../controllers/orders.controller');

 //Middleware
const { orderExists } = require('../middlewares/orders.middleware');
const { mealExists } = require('../middlewares/meals.middleware');
const { protectSession } = require('../middlewares/auth.middleware');

// Define endpoints before activate server listening to requests
const ordersRouter = express.Router();

ordersRouter.use(protectSession);

ordersRouter.post('/', mealExists, createOrder);

ordersRouter.get('/me', getAllOrdersByUser);

ordersRouter.patch('/:id', orderExists, completeOrder);

ordersRouter.delete('/:id', orderExists, cancelOrder);

module.exports = { ordersRouter };