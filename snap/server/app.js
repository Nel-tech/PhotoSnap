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
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// 1️⃣ Trust proxies (for deployments like Heroku, Vercel, Render)
app.enable('trust proxy');

// 2️⃣ Debug logging middleware (add this early)
app.use((req, res, next) => {
  console.log('📱 Request details:', {
    method: req.method,
    url: req.originalUrl,
    origin: req.headers.origin,
    userAgent: req.headers['user-agent']?.substring(0, 50) + '...',
    ip: req.ip,
    timestamp: new Date().toISOString(),
    cookies: req.cookies ? Object.keys(req.cookies).join(', ') : 'none'
  });
  next();
});

// 3️⃣ Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// 4️⃣ FIXED: Use environment variables for allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.PROD_CLIENT_URL || 'https://photo-snap-gallery.vercel.app',
];

// Remove any trailing slashes and filter out undefined values
const cleanedAllowedOrigins = allowedOrigins
  .filter(origin => origin) // Remove undefined/null values
  .map(origin => origin.replace(/\/$/, '')); // Remove trailing slashes

console.log('🌐 Allowed CORS origins:', cleanedAllowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    console.log('🌐 CORS Origin check:', origin);
    
    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin) {
      console.log('✅ No origin - allowing');
      return callback(null, true);
    }
    
    const cleanedOrigin = origin.replace(/\/$/, ''); 
    
    if (cleanedAllowedOrigins.includes(cleanedOrigin)) {
      console.log('✅ Origin allowed:', cleanedOrigin);
      callback(null, true);
    } else {
      console.log('❌ Origin blocked:', cleanedOrigin);
      console.log('📋 Allowed origins:', cleanedAllowedOrigins);
      
      // PRODUCTION: Remove this debug mode and uncomment the error below
      if (process.env.NODE_ENV === 'development' || process.env.DEBUG_CORS === 'true') {
        console.log('🔧 DEBUG MODE: Allowing blocked origin');
        callback(null, true);
      } else {
        // Use this in production:
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cache-Control',
    'X-File-Name'
  ],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200, // Support legacy browsers
  preflightContinue: false,
}));

// Handle preflight requests explicitly
app.options('*', cors());


// // 6️⃣ Rate limiting (re-enable for production)
// const limiter = rateLimit({
//   max: process.env.NODE_ENV === 'production' ? 100 : 1000, // More lenient in dev
//   windowMs: 60 * 60 * 1000, // per hour
//   message: 'Too many requests from this IP, please try again in an hour!',
//   keyGenerator: (req) => req.ip,
//   skip: (req) => {
//     // Skip rate limiting for health checks and options requests
//     return req.path === '/health' || req.method === 'OPTIONS';
//   }
// });
// app.use('/api', limiter);

// 7️⃣ Log requests
if (process.env.NODE_ENV === 'development' || process.env.DEBUG_LOGS === 'true') {
  app.use(morgan('combined')); // More detailed logging
}

// 8️⃣ Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());



// 1️⃣0️⃣ Data sanitization (uncomment when ready)
// app.use(mongoSanitize());
// app.use(xss());

// 1️⃣1️⃣ Prevent parameter pollution
app.use(hpp({
  whitelist: ['sort', 'fields', 'page', 'limit'] // Allow these query params to be duplicated
}));

// 1️⃣2️⃣ Compress responses
app.use(compression());

// 1️⃣3️⃣ Add custom timestamp middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});


app.use('/api/v1/users', userRouter);
app.use('/api/v1/stories', storyRouter);


app.all('*', (req, res, next) => {
  console.log('❓ Unknown route accessed:', req.originalUrl);
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// 4️⃣0️⃣ Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;