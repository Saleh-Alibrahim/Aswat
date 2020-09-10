const express = require('express');
const ms = require('ms');
const bouncer = require("express-bouncer")(ms('1m'), ms('10m'), 4);
const ErrorResponse = require('../utils/errorResponse');


// In case we want to supply our own error (optional)
bouncer.blocked = function (req, res, next, remaining) {
    return next(new ErrorResponse(`لقد قمت بـ العديد من المحاولات الرجاء الانتظار ${(remaining / 1000).toFixed(0)} ثانية قبل اعادة المحاولة `, 403, true));
};

const { getRegisterView,
    getLoginView,
    registerUsers,
    loginUsers,
    getMe,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword,
    logout } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');





const router = express.Router();




router.get('/register', getRegisterView);
router.get('/login', getLoginView);
router.post('/register', registerUsers);
router.post('/login', bouncer.block, loginUsers);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);




module.exports = router;

