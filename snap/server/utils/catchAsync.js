module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    console.error('Error in catchAsync:', err); // ✅ Add this line
    next(err);
  });
};
