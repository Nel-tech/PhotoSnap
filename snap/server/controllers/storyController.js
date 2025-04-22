const fs = require('fs');
const Story = require('../models/storyModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { cloudinary, upload } = require('../controllers/globalController');

// Load initial stories if collection is empty
async function loadStories() {
  try {
    const data = fs.readFileSync('stories.json', 'utf8');
    const stories = JSON.parse(data);
    const existingCount = await Story.countDocuments();
    if (existingCount === 0) {
      await Story.insertMany(stories);
      console.log('Stories uploaded successfully!');
    } else {
      console.log('Stories already exist. Skipping upload.');
    }
  } catch (error) {
    console.error('Error loading stories:', error);
  }
}
loadStories();

// Get all stories
exports.getAllStories = catchAsync(async (req, res, next) => {
  const stories = await Story.find();
  res.status(200).json({
    success: true,
    data: stories,
  });
});

// Get single story details
exports.StoriesDetails = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const story = await Story.findById(id);

  if (!story) return next(new AppError('Story not found', 404));

  res.status(200).json({
    success: true,
    data: story,
  });
});

// Bookmark / Unbookmark story
exports.BookMark = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user?._id;

  const story = await Story.findById(id);
  if (!story) return next(new AppError('Story not found', 404));

  const alreadyBookmarked = story.bookmarkedBy.some((b) => b.equals(userId));

  if (alreadyBookmarked) {
    story.bookmarkedBy.pull(userId);
    await story.save();
    return res.status(200).json({
      success: true,
      message: 'Bookmark removed',
    });
  } else {
    story.bookmarkedBy.push(userId);
    await story.save();
    return res.status(200).json({
      success: true,
      message: 'Story bookmarked',
    });
  }
});

// Get all bookmarks for authenticated user
exports.getUserBookMarkedStories = catchAsync(async (req, res, next) => {
  const userId = req.user?._id;
  if (!userId) return next(new AppError('User not authenticated', 401));

  const bookmarks = await Story.find({ bookmarkedBy: userId });

  if (!bookmarks || bookmarks.length === 0) {
    return res.status(200).json({
      success: false,
      message: 'No bookmarks found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Bookmarked stories retrieved successfully',
    data: bookmarks,
  });
});

// Admin route to get all bookmarked stories (based on bookmarked field)
exports.getAllBookMarkedStories = catchAsync(async (req, res, next) => {
  const stories = await Story.find({ bookmarked: true });
  res.status(200).json({
    success: true,
    data: stories,
  });
});

// Upload a story

 exports.upload = upload.single('image'); 
exports.uploadStory = catchAsync(async (req, res, next) => {
  const userId = req.user?._id;
  if (!userId) return next(new AppError('User not authenticated', 401));

  let {
    title,
    author,
    description,
    categories,
    estimatedReadingTime,
    location,
    language,
  } = req.body;

  let { tags } = req.body;
  const file = req.file;

  console.log('BODY:', req.body);
  console.log('FILE:', req.file);

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  // File validation
  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid image format. Only JPEG, PNG, and WEBP are allowed.',
    });
  }

  if (file.size > MAX_FILE_SIZE) {
    return res.status(400).json({
      status: 'fail',
      message: 'Image is too large. Maximum size allowed is 2MB.',
    });
  }

  // Normalize tags to an array
  if (typeof tags === 'string') {
  tags = [tags];
}
if (typeof categories === 'string') {
  categories = [categories];
}

  // Field validation
  if (
    !title ||
    !author ||
    !description ||
    !categories ||
    !tags?.length ||
    !estimatedReadingTime ||
    !location ||
    !language
  ) {
    return next(
      new AppError('Missing required fields: title, author, description, etc.', 400)
    );
  }

  // Upload image to Cloudinary
  const streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'user_profiles' },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
      stream.end(buffer);
    });
  };

  const result = await streamUpload(file.buffer);

  // Save to DB
  const story = await Story.create({
    user: userId, 
    title,
    author,
    image: result.secure_url,
    description,
    categories,
    tags,
    estimatedReadingTime,
    location,
    language,
    createdBy: userId,
  });

  res.status(201).json({
    success: true,
    message: 'Story uploaded successfully',
    data: story,
    photo: result.secure_url,
  });
});

// Get all uploads for authenticated user
// controllers/storyController.js

exports.getUserUploads = catchAsync(async (req, res, next) => {
  const userId = req.user?._id;
  if (!userId) return next(new AppError('User not authenticated', 401));


  const stories = await Story.find({ createdBy: userId }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: stories.length,
    data: stories,
  });
});
