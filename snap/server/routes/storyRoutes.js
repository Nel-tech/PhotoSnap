const express = require('express')
const router = express.Router()
const storyController = require('../controllers/storyController')
const authController = require('../controllers/authController')

router.get(
  '/public-stories',
  storyController.getAllStories     
)

router.use(authController.protect);
router.get(
  '/get-all-stories',
  authController.restrictTo('user'), 
  storyController.getAllStories      
)
router.post('/upload-story', authController.restrictTo('user'), storyController.upload, storyController.uploadStory)
router.get('/get-user-stories', authController.restrictTo('user'), storyController.getUserUploads)
router.get(
  '/stories-details/:id',
  authController.restrictTo('user'),
  storyController.StoriesDetails
)
router.post('/book-mark/:id',  authController.restrictTo('user'), storyController.BookMark)
router.get('/getUserBookMarkedStories', authController.restrictTo('user'), storyController.getUserBookMarkedStories)
router.get('/get-book-marked-stories', authController.restrictTo('user'), storyController.getAllBookMarkedStories)
module.exports = router