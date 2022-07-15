const express = require('express');
const rateLimit = require('express-rate-limit');

//Global error controller
const { globalErrorHandler } = require('./controllers/error.controller');

//Utils
const { AppError } = require('./utils/appError.util');

// Routers
const { usersRouter } = require('./routes/users.routes');
const { restaurantsRouter } = require('./routes/restaurants.routes');
const { ordersRouter } = require('./routes/orders.routes');
const { mealsRouter } = require('./routes/meals.routes');

// Init express app
const app = express();

// Add to the app the json method
app.use(express.json());

// Limit the number of requests that can be accepted to our server
const limiter = rateLimit({
    max: 5,
    windowMs: 1 * 60 * 1000,
    message: 'Number of requests have been exceeded'
});

app.use(limiter);

// Define endpoints
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/restaurants', restaurantsRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/meals', mealsRouter);

//Hanlde incoming unknown routes to the server
app.all('*', (req, res, next) => {
    next(new AppError(`${req.method} ${req.originalUrl} not found in this server`), 404);
});

//Global error controller
app.use(globalErrorHandler);

module.exports = { app };