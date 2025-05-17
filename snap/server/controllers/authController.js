
const { promisify } = require('util');
const jwt = require('jsonwebtoken')
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, role } = req.body;

  if (!name ||!email || !password || !passwordConfirm) {
    return next(new AppError('All fields are required', 400));
  }

  if (password !== passwordConfirm) {
    return next(new AppError('Passwords do not match!', 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(
      new AppError('Email already in use. Please use a different email.', 400),
    );
  }
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role,
  });

  // const url = `${req.protocol}://${req.get('host')}/me`;


  createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 10000),
    httpOnly: true,
  });

  res.status(200).json({ status: 'success' });
};
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401),
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

//  Only for rendered pages, no errors
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 2) Verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );

      // 3) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 4) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }

    next();
  };

exports.updateMyPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, passwordConfirm } = req.body;
    
    if (!currentPassword || !newPassword || !passwordConfirm) {
      return next(new AppError('Please provide current password, new password and password confirmation', 400));
    }
    const user = await User.findById(req.user.id).select('+password');
    
    if (!(await user.correctPassword(currentPassword, user.password))) {
      return next(new AppError('Your current password is wrong', 401));
    }
  
    user.password = newPassword;
    user.passwordConfirm = passwordConfirm;
  
    await user.save();
    createSendToken(user, 200, req, res);
  } catch (err) {
    return next(new AppError(err.message || 'An error occurred updating password', 500));
  }
};