const fs = require('fs');
const Story = require('../models/storyModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { cloudinary, upload } = require('../controllers/globalController');
const path = require('path')
const axios  = require('axios');


/* -------------------------------- UTILITIES -------------------------------- */

const filterObj = (obj, ...allowedFields) => {
  if (!obj) return {};
  
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const handleFeaturedStoryRotation = async () => {
  const currentDate = new Date();
  let featuredStory = await Story.findOne({ featured: true });
  
  if (featuredStory) {
    const featuredDate = new Date(featuredStory.featuredAt);
    const daysSinceFeatured = (currentDate - featuredDate) / (1000 * 60 * 60 * 24);
    
    if (daysSinceFeatured >= 7) {
      const session = await Story.startSession();
      
      try {
        await session.withTransaction(async () => {
         
          featuredStory.featured = false;
          await featuredStory.save({ session });
          
         
          const newFeaturedStory = await Story.findOne({
            _id: { $ne: featuredStory._id },
            featured: false,
            user: { $exists: true, $ne: null },
            description: { $exists: true, $ne: null },
            title: { $exists: true, $ne: null },
            status: 'Published'
          }).sort({ createdAt: 1 }).session(session);
          
          if (newFeaturedStory) {
            newFeaturedStory.featured = true;
            newFeaturedStory.featuredAt = currentDate;
            await newFeaturedStory.save({ session });
          } else {
           
            featuredStory.featured = true;
            await featuredStory.save({ session });
          }
        });
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        await session.endSession();
      }
    }
  } else {  
   
    const firstValidStory = await Story.findOne({
      user: { $exists: true, $ne: null },
      description: { $exists: true, $ne: null },
      title: { $exists: true, $ne: null },
      status: 'Published'
    }).sort({ createdAt: 1 });
    
    if (firstValidStory) {
      firstValidStory.featured = true;
      firstValidStory.featuredAt = currentDate;
      await firstValidStory.save();
    }
  }
};


exports.rotateFeaturedStory = catchAsync(async (req, res, next) => {
  await handleFeaturedStoryRotation();
  
  const featuredStory = await Story.findOne({ featured: true })
    .populate('user', 'name') 
    .select('title description image author createdAt featuredAt');
  
  if (!featuredStory) {
    return res.status(404).json({
      status: 'fail',
      message: 'No featured story available after rotation'
    });
  }
  
  res.status(200).json({
    status: 'success',
    message: 'Featured story rotation completed',
    data: {
      featuredStory
    }
  });
});

// Main API endpoint for getting featured story
exports.getFeaturedStory = catchAsync(async (req, res, next) => {
 
  await handleFeaturedStoryRotation();
  
  
  const featuredStory = await Story.findOne({ featured: true })
    .populate('user', 'name') 
    .select('title description image author createdAt featuredAt');
  
  if (!featuredStory) {
    return res.status(404).json({
      status: 'fail',
      message: 'No featured story available'
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      featuredStory
    }
  });
});
/* ------------------------------ INITIAL SEEDER ----------------------------- */

async function loadStories() {
  try {
    const data = fs.readFileSync('stories.json', 'utf8');
    const stories = JSON.parse(data);
    const existingCount = await Story.countDocuments();

    if (existingCount === 0) {
      await Story.insertMany(stories);
    } else {
    }
  } catch (error) {
    console.error('Error loading stories:', error);
    return error
  }
}
loadStories();


// const folderPath = path.join(process.cwd(), "public/images");
// const cacheFilePath = path.join(process.cwd(), "upload_cache.json");

// // Load cache file (if it exists)
// let uploadedImages = [];
// if (fs.existsSync(cacheFilePath)) {
//   uploadedImages = JSON.parse(fs.readFileSync(cacheFilePath, "utf8"));
// }

// // Automatically create the folder if it doesn't exist
// if (!fs.existsSync(folderPath)) {
//   fs.mkdirSync(folderPath, { recursive: true });
//   console.log("Created folder:", folderPath);
// }

// // Function to recursively upload images
// async function uploadLocalImages(dir) {
//   const files = fs.readdirSync(dir);

//   for (const file of files) {
//     const filePath = path.join(dir, file);
//     const stat = fs.statSync(filePath);

//     if (stat.isDirectory()) {
//       await uploadLocalImages(filePath);
//     } else if (stat.isFile()) {
//       if (uploadedImages.includes(filePath)) {
//         console.log("Already uploaded:", filePath);
//         continue;
//       }

//       try {
//         const result = await cloudinary.uploader.upload(filePath, {
//           folder: "images",
//         });
//         console.log("Uploaded:", result.secure_url);
//         uploadedImages.push(filePath);
//         fs.writeFileSync(cacheFilePath, JSON.stringify(uploadedImages, null, 2));
//       } catch (err) {
//         console.error("Upload failed for:", filePath, err);
//       }
//     }
//   }
// }

// uploadLocalImages(folderPath).catch((err) =>
//   console.error("Upload process failed:", err)
// );


/* --------------------------- PUBLIC / USER ROUTES -------------------------- */

// Get all stories
exports.getAllStories = catchAsync(async (req, res, next) => {
  const stories = await Story.find({ status: 'Published' });
  res.status(200).json({ success: true,  stories });
});

exports.getStory = catchAsync(async (req, res, next) => {
  const { storyId } = req.params; 
  const story = await Story.findById(storyId);
  if (!story) return next(new AppError('Story not found', 404));

  res.status(200).json({ status: 'success',  story });
});


exports.StoriesDetails = catchAsync(async (req, res, next) => {

  const { id } = req.params; 
  const story = await Story.findById(id);
  if (!story) return next(new AppError('Story not found', 404));

  res.status(200).json({ status: 'success', story });
});



// exports.StoriesDetails = exports.getStory;

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
    embedUrl,
  } = req.body;

  if(embedUrl){
    const supportedDomains = [
    'youtube.com',
    'youtu.be',
    'twitter.com',
    'x.com',
    'instagram.com',
  ];

   const isValidEmbed = supportedDomains.some((domain) =>
    embedUrl.includes(domain)
  );

  if (!isValidEmbed) {
    return res.status(400).json({
      status: 'fail',
      message: 'Only YouTube, Twitter, or Instagram links are allowed for embedUrl.',
    });
  }

  }

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
     status:'Pending',
    language,
    embedUrl,
  });

  res.status(201).json({
    success: true,
    message: 'Story uploaded successfully',
     story,
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
     stories,
  });
});

exports.updateStory = catchAsync(async (req, res, next) => {
  const userId = req.user?._id;
  const { storyId } = req.params;
  
  if (!req.body) {
    return next(new AppError('No data provided for update', 400));
  }

  const filteredBody = filterObj(
    req.body,
    'title', 'author', 'image', 'description',
    'categories', 'tags', 'estimatedReadingTime',
    'location', 'language'
  );
  
  if (Object.keys(filteredBody).length === 0) {
    return next(new AppError('No valid fields to update', 400));
  }

  const updatedStory = await Story.findOneAndUpdate(
    { _id: storyId, user: userId },
    filteredBody,
    { new: true, runValidators: true }
  );

  if (!updatedStory) return next(new AppError('Story not found or unauthorized.', 404));

  res.status(200).json({ status: 'success',  updatedStory });
});

// Delete a user's own story
exports.deleteUploadedStory = catchAsync(async (req, res, next) => {
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
    { new: true }  
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

exports.getBookmarkedStoriesStatus = catchAsync(async (req, res, next) => {
  const userId = req.user?._id;  
  const stories = await Story.find();

  if (!stories) return next(new AppError('No stories found', 404));
  const BookmarkedStatus = stories.map(story => {
    const isBookmarked = story.bookmarkedBy.some(b => b.equals(userId)); 
    return {
      ...story.toObject(),
      isBookmarked,  
    };
  });

  res.status(200).json({
    success: true,
     BookmarkedStatus,
  });
});



// Get all bookmarks of current user
exports.getUserBookMarkedStories = catchAsync(async (req, res, next) => {
  const userId = req.user?._id;

  const bookmarks = await Story.find({ bookmarkedBy: userId });
  
  res.status(200).json({
    success: true,
    message: 'Bookmarked stories retrieved successfully',
     bookmarks 
  });
});



exports.likeStory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user?._id;

  const story = await Story.findById(id);
  if (!story) return next(new AppError('Story not found', 404));

  const alreadyLiked = story.likedBy.some((b) => b.equals(userId));

  if (alreadyLiked) {
    story.likedBy.pull(userId);
    story.like = Math.max(story.like - 1, 0); 
    await story.save();
    return res.status(200).json({ success: true, message: 'Story unliked' });
  } else {
    story.likedBy.push(userId);
    story.like += 1;
    await story.save();
    return res.status(200).json({ success: true, message: 'Story liked' });
  }
});


exports.getUserLikedStories = catchAsync(async (req, res, next) => {
  const userId = req.user?._id;

  const likes = await Story.find({ likedBy: userId });
  if (!likes.length) {
    return res.status(200).json({ success: false, message: 'No user Liked stories found' });
  }

  res.status(200).json({
    success: true,
    message: 'Liked stories retrieved successfully',
     likes,
  });
});
exports.getStoriesByLikeStatus = catchAsync(async (req, res, next) => {
  const userId = req.user?._id;  
  const stories = await Story.find();

  if (!stories) return next(new AppError('No stories found', 404));
  const storiesWithLikeStatus = stories.map(story => {
    const isLiked = story.likedBy.some(b => b.equals(userId)); 
    return {
      ...story.toObject(),
      isLiked,  
    };
  });

  res.status(200).json({
    success: true,
    storiesWithLikeStatus,
  });
});

exports.deleteLikes = catchAsync(async (req, res, next) => {
  const { id } = req.params;  
  const userId = req.user?._id;

  const likes = await Story.findOneAndUpdate(
    { _id: id, likedBy: userId },  
    { $pull: { likedBy: userId } }, 
    { new: true } 
  );

  if (!likes) {
    return res.status(404).json({
      status: 'fail',
      message: 'Liked Stories not found or you do not have permission to delete it'
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Liked Stories deleted successfully'
  });
});




exports.views = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user?._id;

  const story = await Story.findById(id);
  if (!story) return next(new AppError('Story not found', 404));

  const alreadyViewed = story.viewedBy.some((b) => b.equals(userId));

  if (!alreadyViewed) {
    story.viewedBy.push(userId);
    story.views += 1;
    await story.save();
  }

  return res.status(200).json({ success: true, message: 'Story viewed' });
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
  res.status(200).json({ success: true,  stories });
});

// Admin - Get all bookmarked stories (marked true)
exports.getAllBookMarkedStories = catchAsync(async (req, res, next) => {
  const stories = await Story.find({ bookmarked: true });
  res.status(200).json({ success: true,  stories });
});

// Admin - Accept or reject story
// Get all pending stories (admin view)
exports.getAllPendingStories = catchAsync(async (req, res, next) => {
  const stories = await Story.find({ status: 'Pending' }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: stories.length,
     stories,
  });
});

exports.updateStoryStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to perform this action.',
    });
  }

  if (!status || !['Published', 'rejected'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or missing status value.',
    });
  }
  const story = await Story.findByIdAndUpdate(id, { status }, { new: true });

  if (!story) {
    return res.status(404).json({
      success: false,
      message: 'Story not found.',
    });
  }
  res.status(200).json({
    success: true,
    message: `Story has been successfully ${status}.`,
     story,
  });
});


// NotifyAdmins
exports.notifyAdmins = async (req, res, next) => {
  try {
    await axios.post(
      "https://onesignal.com/api/v1/notifications",
      {
        app_id: process.env.ONE_SIGNAL_APP_ID,
        headings: { en: "📝 New Story Uploaded" },
        contents: { en: "A new story was submitted by a user." },
        filters: [
          { field: "tag", key: "role", relation: "=", value: "admin" },
        ],
      },
      {
        headers: {
          Authorization: `Basic ${process.env.ONE_SIGNAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ success: true, message: "Admins notified successfully." });
  } catch (error) {
    console.error("Notification error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Failed to notify admins." });
  }
};

