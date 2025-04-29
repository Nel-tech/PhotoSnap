const fs = require('fs');
const Story = require('../models/storyModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { cloudinary, upload } = require('../controllers/globalController');
const cron = require('node-cron');

/* -------------------------------- UTILITIES -------------------------------- */

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.rotateFeaturedStory = catchAsync(async (req, res, next) => {
  const currentDate = new Date();

  let featuredStory = await Story.findOne({ featured: true });

  if (featuredStory) {
    const featuredDate = new Date(featuredStory.featuredAt);
    const daysSinceFeatured = (currentDate - featuredDate) / (1000 * 60 * 60 * 24); 
    if (daysSinceFeatured >= 7) {
      featuredStory.featured = false;
      await featuredStory.save();

      const newFeaturedStory = await Story.findOne({ featured: false });

      if (newFeaturedStory) {
        newFeaturedStory.featured = true;
        newFeaturedStory.featuredAt = currentDate;
        await newFeaturedStory.save();

        console.log('Rotated to new featured story:', newFeaturedStory.title);

        return res.status(200).json({
          status: 'success',
          message: `Story '${newFeaturedStory.title}' is now featured.`,
          data: newFeaturedStory
        });
      } else {
        console.warn('No new story available to feature. Keeping old one.');
        return res.status(200).json({
          status: 'info',
          message: 'No new story to feature. Returning the current featured story.',
          data: featuredStory
        });
      }
    } else {
      
      return res.status(200).json({
        status: 'success',
        message: 'Returning current featured story.',
        data: featuredStory
      });
    }
  } else {
   const firstStory = await Story.findOne({
  createdBy: { $exists: true, $ne: null },
  description: { $exists: true, $ne: null }
});

if (firstStory) {
  firstStory.featured = true;
  firstStory.featuredAt = currentDate;
  await firstStory.save();

  return res.status(200).json({
    status: 'success',
    message: `No previous featured story. '${firstStory.title}' is now featured.`,
    data: firstStory
  });
} else {
  return res.status(404).json({
    status: 'fail',
    message: 'No valid stories found to feature.'
  });
}

  }
});

/* ------------------------------ INITIAL SEEDER ----------------------------- */

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

/* --------------------------- PUBLIC / USER ROUTES -------------------------- */

// Get all stories
exports.getAllStories = catchAsync(async (req, res, next) => {
  const stories = await Story.find({ status: 'Published' });
  res.status(200).json({ success: true, data: stories });
});

// Get single story by ID
exports.getStory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const story = await Story.findById(id);
  if (!story) return next(new AppError('Story not found', 404));

  res.status(200).json({ status: 'success', data: story });
});


// Alias for story details (if needed elsewhere)
exports.StoriesDetails = exports.getStory;

// Upload single image file
exports.upload = upload.single('image');

// Upload a new story
exports.uploadStory = catchAsync(async (req, res, next) => {
  const userId = req.user?._id;
  if (!userId) return next(new AppError('User not authenticated', 401));

  const {
    title,
    tags,
    author,
    description,
    categories,
    estimatedReadingTime,
    location,
    language,
  } = req.body;

  const file = req.file;
  if (!file) return res.status(400).json({ message: 'No file uploaded' });

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_FILE_SIZE = 2 * 1024 * 1024;

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

  // Normalize tags
let normalizedTags = [];
if (Array.isArray(tags)) {
  normalizedTags = tags;
} else if (typeof tags === 'string') {
  try {
    normalizedTags = JSON.parse(tags);
  } catch {
    normalizedTags = [tags]; 
  }
}

// Normalize categories
let normalizedCategories = [];
if (Array.isArray(categories)) {
  normalizedCategories = categories;
} else if (typeof categories === 'string') {
  try {
    normalizedCategories = JSON.parse(categories);
  } catch {
    normalizedCategories = [categories]; 
  }
}


  // Check for required fields
  if (
    !title || !author || !description ||
    !normalizedCategories || !normalizedTags?.length ||
    !estimatedReadingTime || !location || !language
  ) {
    return next(new AppError('Missing required fields', 400));
  }

  // Upload image to Cloudinary
  const streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'user_profiles' },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      stream.end(buffer);
    });
  };
  const result = await streamUpload(file.buffer);

  const story = await Story.create({
    user: userId,
    createdBy: userId,
    title,
    author,
    image: result.secure_url,
    description,
    categories: normalizedCategories,
    tags: normalizedTags,
    estimatedReadingTime,
    location,
     status: 'pending',
    language,
  });

  res.status(201).json({
    success: true,
    message: 'Story uploaded successfully',
    data: story,
    photo: result.secure_url,
  });
});

// Get all user uploaded stories
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

// Update a user's own story
exports.updateStory = catchAsync(async (req, res, next) => {
  const userId = req.user?._id;
  const { storyId } = req.params;

  const filteredBody = filterObj(
    req.body,
    'title', 'author', 'image', 'description',
    'categories', 'tags', 'estimatedReadingTime',
    'location', 'language'
  );

  const updatedStory = await Story.findOneAndUpdate(
    { _id: storyId, user: userId },
    filteredBody,
    { new: true, runValidators: true }
  );

  if (!updatedStory) return next(new AppError('Story not found or unauthorized.', 404));

  res.status(200).json({ status: 'success', data: updatedStory });
});

// Delete a user's own story
exports.deleteUserStory = catchAsync(async (req, res, next) => {
  const userId = req.user?._id;
  const { storyId } = req.params;

  const deleted = await Story.findOneAndDelete({ _id: storyId, user: userId });
  if (!deleted) return next(new AppError('Story not found or unauthorized', 404));

  res.status(200).json({ status: 'success', message: 'Story deleted successfully' });
});

// Bookmark or unbookmark a story
exports.BookMark = catchAsync(async (req, res, next) => {
  const userId = req.user?._id;
  const { id } = req.params;

  const story = await Story.findById(id);
  if (!story) return next(new AppError('Story not found', 404));

  const alreadyBookmarked = story.bookmarkedBy.some((b) => b.equals(userId));

  if (alreadyBookmarked) {
    story.bookmarkedBy.pull(userId);
    await story.save();
    return res.status(200).json({ success: true, message: 'Bookmark removed' });
  } else {
    story.bookmarkedBy.push(userId);
    await story.save();
    return res.status(200).json({ success: true, message: 'Story bookmarked' });
  }
});
exports.deleteBookmark = catchAsync(async (req, res, next) => {
  const { id } = req.params;  
  const userId = req.user?._id;

  const bookmark = await Story.findOneAndUpdate(
    { _id: id, bookmarkedBy: userId },  
    { $pull: { bookmarkedBy: userId } },
    { new: true }  // Return the updated document
  );

  if (!bookmark) {
    return res.status(404).json({
      status: 'fail',
      message: 'Bookmark not found or you do not have permission to delete it'
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Bookmark deleted successfully'
  });
});



// Get all bookmarks of current user
exports.getUserBookMarkedStories = catchAsync(async (req, res, next) => {
  const userId = req.user?._id;

  const bookmarks = await Story.find({ bookmarkedBy: userId });
  if (!bookmarks.length) {
    return res.status(200).json({ success: false, message: 'No bookmarks found' });
  }

  res.status(200).json({
    success: true,
    message: 'Bookmarked stories retrieved successfully',
    data: bookmarks,
  });
});

/* ------------------------------- ADMIN ROUTES ------------------------------ */

// Admin - Get all stories (pending, approved, etc.)
exports.getAllPendingStories = catchAsync(async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to access this resource.',
    });
  }

  const stories = await Story.find();
  res.status(200).json({ success: true, data: stories });
});

// Admin - Get all bookmarked stories (marked true)
exports.getAllBookMarkedStories = catchAsync(async (req, res, next) => {
  const stories = await Story.find({ bookmarked: true });
  res.status(200).json({ success: true, data: stories });
});

// Admin - Accept or reject story
// Get all pending stories (admin view)
exports.getAllPendingStories = catchAsync(async (req, res, next) => {
  const stories = await Story.find({ status: 'pending' }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: stories.length,
    data: stories,
  });
});

exports.updateStoryStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  // 1. Authorization check
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to perform this action.',
    });
  }

  // 2. Validate status
  if (!status || !['Published', 'rejected'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or missing status value.',
    });
  }

  // 3. Update the story
  const story = await Story.findByIdAndUpdate(id, { status }, { new: true });

  if (!story) {
    return res.status(404).json({
      success: false,
      message: 'Story not found.',
    });
  }

  // 4. Send response
  res.status(200).json({
    success: true,
    message: `Story has been successfully ${status}.`,
    data: story,
  });
});
