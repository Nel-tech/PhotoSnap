require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');


 cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
})




// ✅ Setup multer with memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = {
  cloudinary,
  upload,
};


// const filterObj = (obj, ...allowedFields) => {
//   const newObj = {};
//   Object.keys(obj).forEach((el) => {
//     if (allowedFields.includes(el)) newObj[el] = obj[el];
//   });
//   return newObj;
// };

// module.exports = filterObj;
