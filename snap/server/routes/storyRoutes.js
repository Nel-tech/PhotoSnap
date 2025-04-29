const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const authController = require('../controllers/authController');

// ─── 1. PUBLIC ROUTES ───────────────────────────────
router.get('/public-stories', storyController.getAllStories);

// ─── 2. PROTECTED ROUTES ────────────────────────────
router.use(authController.protect);

// ─── 3. USER ROUTES ─────────────────────────────────
router.get(
  '/get-all-stories',
  authController.restrictTo('user'),
  storyController.getAllStories
);

router.post(
  '/upload-story',
  authController.restrictTo('user'),
  storyController.upload,
  storyController.uploadStory
);

router.get(
  '/get-user-stories',
  authController.restrictTo('user'),
  storyController.getUserUploads
);

router.get(
  '/get-story/:storyId',
  authController.restrictTo('user'),
  storyController.getStory
);

router.put(
  '/edit-stories',
  authController.restrictTo('user'),
  storyController.updateStory
);

router.delete(
  '/delete-user-story/:storyId',
  authController.restrictTo('user'),
  storyController.deleteUserStory
);

router.get(
  '/stories-details/:id',
  authController.restrictTo('user'),
  storyController.StoriesDetails
);

router.post(
  '/book-mark/:id',
  authController.restrictTo('user'),
  storyController.BookMark
);
router.delete('/delete-bookmark/:id',authController.restrictTo('user'), storyController.deleteBookmark);
router.get(
  '/getUserBookMarkedStories',
  authController.restrictTo('user'),
  storyController.getUserBookMarkedStories
);

router.get(
  '/get-book-marked-stories',
  authController.restrictTo('user'),
  storyController.getAllBookMarkedStories
);

router.get(
  '/featured-stories',
  authController.restrictTo('user'),
  storyController.rotateFeaturedStory
);

// ─── 4. ADMIN ROUTES ────────────────────────────────
router.get(
  '/get-all-pending-stories',
  authController.restrictTo('admin'),
  storyController.getAllPendingStories
);
router.patch(
  '/update-story-status/:id',
  authController.restrictTo('admin'),
  storyController.updateStoryStatus
);

module.exports = router;
