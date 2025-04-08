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
  authController.restrictTo('user'), // Check role first
  storyController.getAllStories      // Then run controller
)
//router.post('/create-story', storyController.createStory, authController.protect, authController.restrictTo('user'))
router.get(
  '/stories-details/:id',
  authController.restrictTo('user'),
  storyController.StoriesDetails
)
module.exports = router