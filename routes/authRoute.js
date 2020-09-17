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
    getResetPasswordView,
    logout } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');



const router = express.Router();


// Add custom message when user blocked
bouncer.blocked = function (req, res, next, remaining) {
    const time = convert((remaining / 1000).toFixed(0));
    const seconds = time.seconds;
    const minutes = time.minutes;
    return next(new ErrorResponse(`لقد قمت بـ العديد من المحاولات الرجاء الانتظار  ${minutes}:${seconds} د قبل إعادة المحاولة `,
        403, true));
};





router.route('/register')
    .get(getRegisterView)
    .post(registerUsers);

router.route('/login')
    .get(getLoginView)
    .post(bouncer.block, loginUsers);

router.get('/logout', protect, logout);

router.get('/forgotpassword', getforgotPasswordView);

router.post('/forgotpassword', bouncer.block, forgotPassword);

router.route('/resetpassword/:resettoken')
    .get(getResetPasswordView)
    .put(resetPassword);




module.exports = router;

