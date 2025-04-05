const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
//const mongoSanitize = require('express-mongo-sanitize');
//const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const userRouter = require('./routes/userRoutes');
// const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
app.use(express.json());

// 1️⃣ Trust proxies (for deployments like Heroku, Vercel)
app.enable('trust proxy');



// 3️⃣ Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// 4️⃣ Enable CORS
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));

// 5️⃣ Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", 'ws://127.0.0.1:49777', 'https:'],
      },
    },
  })
);

// 6️⃣ Limit repeated requests to public APIs
const limiter = rateLimit({
  max: 100, // max requests
  windowMs: 60 * 60 * 1000, // per hour
  message: 'Too many requests from this IP, please try again in an hour!',
  keyGenerator: (req, res) => req.ip,
});
app.use('/api', limiter);

// 7️⃣ Log requests in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 8️⃣ Body parsers (handle form data and JSON)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());




// 1️⃣1️⃣ Prevent parameter pollution
app.use(hpp());

// 1️⃣2️⃣ Compress responses
app.use(compression());

// 1️⃣3️⃣ Add custom timestamp middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2️⃣0️⃣ ROUTES
app.use('/api/v1/users', userRouter);

// 3️⃣0️⃣ Handle unknown routes
// app.all('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

// 4️⃣0️⃣ Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
