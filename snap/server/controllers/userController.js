
exports.getMe = (req, res, next) => {
 res.status(200).json({
    status: 'success',
    data: {
      user: req.user, 
    },
  });
};


