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


const corsOptions = {
  origin: function (origin, callback) {
    
    if (!origin) return callback(null, true);
    
    const cleanOrigin = origin.replace(/\/$/, '');
    
    if (process.env.NODE_ENV === 'development' && cleanOrigin.includes('localhost')) {
      return callback(null, true);
    }
    
    if (cleanOrigin.match(/^https?:\/\/localhost:\d+$/)) {
      return callback(null, true);
    }
  
    if (cleanOrigin === 'https://photo-snap-gallery.vercel.app') {
      return callback(null, true);
    }
    
    
    if (cleanOrigin.match(/^https:\/\/photo-snap.*\.vercel\.app$/)) {
      return callback(null, true);
    }
    
    callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cookie',
    'Cache-Control'
  ],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};


app.use(cors(corsOptions));


app.options('*path', cors(corsOptions));


app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
  keyGenerator: (req) => req.ip,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Security middleware (after body parsing)
app.use(hpp());
app.use(compression());

// Logging middleware (only add once)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🍪 Cookies:', req.cookies);
    console.log('🔑 Authorization:', req.headers.authorization);
  }
  next();
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'PhotoSnap API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    endpoints: {
      users: '/api/v1/users',
      stories: '/api/v1/stories'
    }
  });
});


app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});


app.use('/api/v1/users', userRouter);
app.use('/api/v1/stories', storyRouter);

// Catch-all route for undefined endpoints
app.all('*path', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  
  // Handle CORS errors specifically
  if (err.message.includes('Not allowed by CORS')) {
    return res.status(403).json({
      status: 'error',
      message: 'CORS policy violation',
      error: err.message
    });
  }
  
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  
  res.status(statusCode).json({
    status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      timestamp: new Date().toISOString()
    })
  });
});

module.exports = app;