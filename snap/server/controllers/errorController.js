const handleCastErrorDB = (err) => {
  const error = new Error(`Invalid ${err.path}: ${err.value}.`);
  error.statusCode = 400;
  error.status = 'fail';
  error.isOperational = true;
  return error;
};

const handleDuplicateFieldsDB = (err) => {
  const match = err.errmsg?.match(/(["'])(\\?.)*?\1/);
  const value = match ? match[0] : 'duplicate value';
  const error = new Error(`Duplicate field value: ${value}. Please use another value!`);
  error.statusCode = 400;
  error.status = 'fail';
  error.isOperational = true;
  return error;
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const error = new Error(`Invalid input data. ${errors.join('. ')}`);
  error.statusCode = 400;
  error.status = 'fail';
  error.isOperational = true;
  return error;
};

const handleJWTError = () => {
  const error = new Error('Invalid token. Please log in again!');
  error.statusCode = 401;
  error.status = 'fail';
  error.isOperational = true;
  return error;
};

const handleJWTExpiredError = () => {
  const error = new Error('Your token has expired! Please log in again.');
  error.statusCode = 401;
  error.status = 'fail';
  error.isOperational = true;
  return error;
};

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode || 500).json({
      status: err.status || 'error',
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  console.error('ERROR 💥', err);
  return res.status(err.statusCode || 500).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    console.error('ERROR 💥', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }

  console.error('ERROR 💥', err);
  return res.status(500).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, message: err.message };

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
