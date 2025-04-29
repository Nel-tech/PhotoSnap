const User = require('../models/userModel')
const bcrypt = require('bcryptjs');

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

// const filterObj = (obj, ...allowedFields) => {
//   const newObj = {};
//   Object.keys(obj).forEach((el) => {
//     if (allowedFields.includes(el)) newObj[el] = obj[el];
//   });
//   return newObj;
// };


// exports.updateMe = async (req, res) => {
//   try {
   
//     if (req.body.password || req.body.passwordConfirm) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'This route is not for password updates. Please use /updateMyPassword.',
//       });
//     }

    
//     const filteredBody = filterObj(req.body, 'name', 'email');

//     const updatedUser = await User.findByIdAndUpdate(
//       req.user._id,
//       filteredBody,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ status: 'error', message: 'User not found.' });
//     }

//     res.status(200).json({
//       status: 'success',
//       data: updatedUser,
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'error',
//       message: err.message,
//     });
//   }
// };




// exports.updateMyPassword = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select('+password');

//     if (!user) {
//       return res.status(404).json({ status: 'error', message: 'User not found.' });
//     }

    
//     const correct = await bcrypt.compare(req.body.currentPassword, user.password);
//     if (!correct) {
//       return res.status(401).json({ status: 'error', message: 'Your current password is wrong.' });
//     }

//     user.password = req.body.newPassword;
//     await user.save(); 

//     res.status(200).json({
//       status: 'success',
//       message: 'Password updated successfully.',
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'error',
//       message: err.message,
//     });
//   }
// };



