
exports.getMe = (req, res, next) => {
 res.status(200).json({
    status: 'success',
    data: {
      user: req.user, 
    },
  });
};

exports.getAllUsers = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      users: req.user, 
    },
  });
};

exports.createStory = async(req,res) => {
    
}
