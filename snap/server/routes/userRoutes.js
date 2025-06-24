const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/send-reset-token', authController.HandleRequestToken)
router.post('/reset-password', authController.ResetPassword)


// Protect all routes after this middleware
router.use(authController.protect);
router.get('/getMe', userController.getMe);
router.patch('/updateMe', authController.restrictTo('user'), userController.updateMe);


module.exports = router;
