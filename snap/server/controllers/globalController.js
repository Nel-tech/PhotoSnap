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



