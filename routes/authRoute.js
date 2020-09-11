const express = require('express');
const ms = require('ms');
const bouncer = require("express-bouncer")(ms('2m'), ms('10m'), 5);
const ErrorResponse = require('../utils/errorResponse');
const convert = require('convert-seconds');
const { getRegisterView,
    getLoginView,
    registerUsers,
    loginUsers,
    getMe,
    forgotPassword,
    getforgotPasswordView,
    resetPassword,
    updateDetails,
    updatePassword,
    logout } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');



const router = express.Router();


// Add custom message when user blocked
bouncer.blocked = function (req, res, next, remaining) {
    const time = convert((remaining / 1000).toFixed(0));
    const seconds = time.seconds;
    const minutes = time.minutes;
    return next(new ErrorResponse(`لقد قمت بـ العديد من المحاولات الرجاء الانتظار  ${minutes}:${seconds} د قبل إعادة المحاولة `, 403, true));
};





router.get('/register', getRegisterView);
router.get('/login', getLoginView);
router.post('/register', registerUsers);
router.post('/login', bouncer.block, loginUsers);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.get('/forgotpassword', getforgotPasswordView);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);




module.exports = router;

