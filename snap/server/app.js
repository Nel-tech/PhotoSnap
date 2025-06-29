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

// 1️⃣ Trust proxies (for deployments like Heroku, Vercel)
app.enable('trust proxy');

// 2️⃣ Debug logging middleware (add this early)
app.use((req, res, next) => {
  console.log('📱 Request details:', {
    method: req.method,
    url: req.originalUrl,
    origin: req.headers.origin,
    userAgent: req.headers['user-agent']?.substring(0, 50) + '...',
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
  next();
});

// 3️⃣ Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// 4️⃣ Enable CORS with debugging
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
      // Temporarily allow all origins for debugging - REMOVE IN PRODUCTION
      console.log('🔧 DEBUG MODE: Allowing blocked origin');
      callback(null, true);
      // Use this in production:
      // callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
}));

// 5️⃣ Set security HTTP headers (less restrictive for debugging)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", 'ws://127.0.0.1:49777', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false, // Less restrictive
  })
);

// 6️⃣ Limit repeated requests to public APIs (DISABLED FOR DEBUGGING)
// const limiter = rateLimit({
//   max: 100, // max requests
//   windowMs: 60 * 60 * 1000, // per hour
//   message: 'Too many requests from this IP, please try again in an hour!',
//   keyGenerator: (req, res) => req.ip,
// });
// app.use('/api', limiter);

// 7️⃣ Log requests (enable in production for debugging)
if (process.env.NODE_ENV === 'development' || process.env.DEBUG_LOGS === 'true') {
  app.use(morgan('dev'));
}

// 8️⃣ Body parsers (handle form data and JSON)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// 9️⃣ Additional debugging middleware for API routes
app.use('/api', (req, res, next) => {
  console.log('🔍 API Route hit:', {
    path: req.path,
    method: req.method,
    headers: {
      'content-type': req.headers['content-type'],
      'authorization': req.headers.authorization ? 'Bearer [TOKEN]' : 'None',
      'origin': req.headers.origin,
    },
    body: req.method === 'POST' ? { ...req.body, password: req.body.password ? '[HIDDEN]' : undefined } : undefined
  });
  next();
});

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
app.use('/api/v1/stories', storyRouter);

// 2️⃣1️⃣ Add a health check route for testing
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    ip: req.ip,
    headers: req.headers 
  });
});

// 3️⃣0️⃣ Handle unknown routes
// app.all('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

// 4️⃣0️⃣ Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;