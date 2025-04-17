const User = require('../models/userModel')

exports.getAllUsers = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      users: req.user, 
    },
  });
};

exports.getMe = (req,res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user, 
    },
  });
}

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = async(req,res) => {
  try {
    const filteredBody = filterObj(req.body, 'name', 'email', 'password');

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ status: 'error', message: 'User not found.' });
    }

    res.status(200).json({
      status: 'success',
      data: updatedUser, 
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
}
// exports.createStory = async(req,res) => {
    
// }

