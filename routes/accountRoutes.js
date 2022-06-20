const express = require('express')

const accountController = require('../controllers/accountControllers');

const router = express.Router();



// Signup
router.get('/signup', accountController.get_signup);

router.post('/signup', accountController.post_signup);

// Login 
router.get('/login', accountController.get_login);

router.post('/login', accountController.post_login);

// forget password
router.get('/forgetpassword', accountController.get_forgetpassword);

// request reset password
router.post('/forgetpassword', accountController.post_forgetpassword);

// Back to site
router.get('/backtosite', accountController.backtosite);

module.exports = router;