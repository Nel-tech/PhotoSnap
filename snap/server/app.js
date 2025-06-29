const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const userRouter = require('./routes/userRoutes');
const storyRouter = require('./routes/storyRoutes');
const AppError = require('./utils/appError');

const app = express();

app.enable('trust proxy');

// CORS configuration FIRST
const allowedOrigins = [
  'http://localhost:3000',                            // dev
  'https://photo-snap-gallery.vercel.app',           // production 
];

const isProduction = process.env.NODE_ENV === 'production';

const corsOptions = {
  origin: function (origin, callback) {
    console.log('🌐 CORS Origin check:', origin);

    if (!origin) return callback(null, true); // Allow Postman, mobile apps, curl

    const cleanedOrigin = origin.replace(/\/$/, '');

    if (allowedOrigins.includes(cleanedOrigin)) {
      console.log('✅ Origin allowed:', cleanedOrigin);
      callback(null, true);
    } else {
      if (isProduction) {
        console.log('❌ Origin blocked:', cleanedOrigin);
        callback(new Error('Not allowed by CORS'));
      } else {
        console.log('🔧 Dev Mode: Allowing blocked origin:', cleanedOrigin);
        callback(null, true); // Allow unknown origins in dev
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*path', cors(corsOptions));

// Other middleware
app.use(express.static(path.join(__dirname, 'public')));

const limiter = rateLimit({
  max: 100, 
  windowMs: 60 * 60 * 1000, 
  message: 'Too many requests from this IP, please try again in an hour!',
  keyGenerator: (req, res) => req.ip,
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(hpp());
app.use(compression());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// API ROUTES FIRST
app.use('/api/v1/users', userRouter);
app.use('/api/v1/stories', storyRouter);

// Root route AFTER API routes
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'PhotoSnap API is running!',
    version: '1.0.0',
    endpoints: {
      users: '/api/v1/users',
      stories: '/api/v1/stories'
    }
  });
});

// Catch-all route LAST
app.all('*path', (req, res, next) => {
  console.log('🚫 CATCH-ALL HIT:', req.originalUrl);
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;