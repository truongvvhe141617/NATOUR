const express = require('express');
const path = require('path');
const hpp = require('hpp');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routers/toursRouters');
const userRouter = require('./routers/userRouters');
const reviewRouter = require('./routers/reviewRouters');
const bookingRouter = require('./routers/bookingRoutes');
const APP = express();

APP.set('view engine', 'pug');
APP.set('views', path.join(__dirname, 'views'));

// Set security HTTP
APP.use(helmet());
APP.use(
  helmet.contentSecurityPolicy({
    directives: {
      baseUri: ["'self'"],
      defaultSrc: ["'self'", 'http:', 'https:', 'ws:', 'blob:', 'data:'],
      fontSrc: ["'self'", 'https:', 'data:'],
      scriptSrc: ["'self'", 'https:', 'blob:'],
      objectSrc: ["'none'"],
      styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
      upgradeInsecureRequests: [],
    },
  })
);

// Data sanitization (NoSQL Injection)
APP.use(mongoSanitize());

// Data sanitization (XSS Injection)
APP.use(xss());

//Development login
if (process.env.NODE_ENV === 'development') {
  APP.use(morgan('dev'));
}

// Limit requests from same IP
const limiter = rateLimit({
  max: 100, //Amount of requests allowed
  windowMs: 60 * 60 * 100, //Time interval per allowed requested
  message: 'Too many requests, please try again in 1 hour',
});
APP.use('/api', limiter);
// Prevent parameter pollution
APP.use(
  hpp({
    whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 'maxGroupSize', 'difficulty', 'price'],
  })
);
// Body parser, reading data from body into req.body
APP.use(express.json({ limit: '10kb' }));
APP.use(express.urlencoded({ extended: true, limit: '10kb' }));
APP.use(cookieParser());

APP.use(compression());

// Serving static files
APP.use(express.static(path.join(__dirname, 'public')));
APP.get('/', (req, res) => {
  res.status(200).render('base');
});
//// MOUNT ROUTING
APP.use('/api/v1/tours', tourRouter);
APP.use('/api/v1/users', userRouter);
APP.use('/api/v1/reviews', reviewRouter);
APP.use('/api/v1/bookings', bookingRouter);

APP.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});

APP.use(globalErrorHandler);
// Export app for server
module.exports = APP;
