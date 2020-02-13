const ctrl = require('../controller')
const authApi = require('../config/auth')
const bodyParser = require('body-parser');
let urlencodedParser = bodyParser.json();
const express = require('express');
const userCtrl = ctrl.users;
let router = express.Router();

router.post('/signUp',urlencodedParser, userCtrl.registration);
router.post('/login',urlencodedParser, userCtrl.loginUser);
router.get('/verifyEmailUrl',urlencodedParser, userCtrl.verifyEmail);
router.post('/forgotPasswordOtp',urlencodedParser, userCtrl.forgotPasswordOtp);
router.put('/resetPassword',urlencodedParser, userCtrl.resetPassword);
// router.use(authApi.auth); //add auth middleware
// router.put('/updateProfile',urlencodedParser, userCtrl.updateProfile);
router.get('/getProfile',urlencodedParser, userCtrl.getProfile);
module.exports = router;