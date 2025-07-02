
const { promisify } = require('util');
const jwt = require('jsonwebtoken')
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const PasswordReset = require('../models/PasswordResetModel');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs')

const signToken = (id, role) => 
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id, user.role);
  
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // This is the key change
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    data: { user },
  });
};


const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: "Email is required" };
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Please enter a valid email address" };
  }

  const allowedDomains = [
    '@gmail.com', 
    '@yahoo.com',
    '@outlook.com',
    '@hotmail.com'
  ];

  const isAllowedDomain = allowedDomains.some(domain =>
    email.toLowerCase().endsWith(domain)
  );

  if (!isAllowedDomain) {
    return {
      isValid: false,
      message: "Only Gmail, Outlook, HotMail, Yahoo email addresses are allowed"
    };
  }

  return { isValid: true };
};


exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, role } = req.body;

  if (!name ||!email || !password || !passwordConfirm) {
    return next(new AppError('All fields are required', 400));
  }

  if (password !== passwordConfirm) {
    return next(new AppError('Passwords do not match!', 400));
  }

  const emailValidation = validateEmail(email)
  if(!emailValidation.isValid){
    return next(new AppError(emailValidation.message, 400)); 
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
   
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }

    next();
  };

exports.HandleRequestToken = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ error: emailValidation.message });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    
    const existingToken = await PasswordReset.findOne({
      user: user._id, 
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (existingToken) {
      const waitTime = Math.ceil(
        (new Date(existingToken.expiresAt).getTime() - Date.now()) / 60000
      );
      
      return res.status(429).json({ 
        alreadyExists: true,
        waitTime,
        expiresAt: existingToken.expiresAt,
        message: `A reset token has already been requested. Please wait ${waitTime} minute(s) before requesting a new one.`,
      });
    }

    const resetToken = uuidv4();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const tokenRecord = await PasswordReset.create({
      token: resetToken,
      user: user._id, 
      expiresAt,
      used: false,
    });

    return res.status(200).json({
      message: "Token successfully generated",
      token: resetToken,
      tokenId: tokenRecord._id,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (err) {
    console.error("Request token error:", err);
    next(new AppError('Internal Server Error', 500));
  }
};

exports.ResetPassword = async (req, res, next) => {
  const { resetToken, newPassword } = req.body;

  try {
    const tokenRecord = await PasswordReset.findOne({ token: resetToken }).populate('user');

    if (!tokenRecord || tokenRecord.used || tokenRecord.expiresAt < new Date()) {
        return next(new AppError('Invalid or expired token', 400));
    }
    if (!newPassword || newPassword.length < 8) { 
  return next(new AppError('Password must be at least 8 characters long', 400));
}

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { _id: tokenRecord.user._id }, 
      { $set: { password: hashedPassword } }
    );

    await PasswordReset.updateOne(
      { token: resetToken },
      { $set: { used: true } }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
     return next(new AppError('Internal Server Error', 500));
  }
};
