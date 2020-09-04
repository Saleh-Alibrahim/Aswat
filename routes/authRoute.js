const express = require('express');

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
router.post('/login', loginUsers);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);




module.exports = router;

