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
const storyRouter = require('./routes/storyRoutes');
// const AppError = require('./utils/appError');


const app = express();


app.enable('trust proxy');

app.use(express.static(path.join(__dirname, 'public')));

const allowedOrigins = [
  'http://localhost:3000',
  'https://photo-snap-gallery.vercel.app',
];
app.use(cors({
  origin: function (origin, callback) {
    console.log('🌐 CORS Origin check:', origin);
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      console.log('✅ No origin - allowing');
      return callback(null, true);
    }
    
    const cleanedOrigin = origin.replace(/\/$/, ''); 
    
    if (allowedOrigins.includes(cleanedOrigin)) {
      console.log('✅ Origin allowed:', cleanedOrigin);
      callback(null, true);
    } else {
      console.log('❌ Origin blocked:', cleanedOrigin);
      console.log('🔧 DEBUG MODE: Allowing blocked origin');
      callback(null, true);

    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
}));


// 6️⃣ Limit repeated requests to public APIs (DISABLED FOR DEBUGGING)
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

// 1️⃣2️⃣ Compress responses
app.use(compression());

// 1️⃣3️⃣ Add custom timestamp middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2️⃣0️⃣ ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/stories', storyRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;