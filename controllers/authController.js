const crypto = require('crypto');
const path = require('path');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/UserModel');
const ErrorResponse = require('../utils/errorResponse');


// @desc      Render the register page
// @route     GET /auth/register
// @access    Public
exports.getRegisterView = asyncHandler(async (req, res, next) => {
  res.render('registerView');
});

// @desc      Render the login page
// @route     GET /auth/login
// @access    Public
exports.getLoginView = asyncHandler(async (req, res, next) => {
  res.render('loginView');
});

// @desc      Register user
// @route     POST /auth/register
// @access    Public
exports.registerUsers = asyncHandler(async (req, res, next) => {

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(new ErrorResponse(`الرجاء ادخال الاسم و الايميل و كلمة المرور`, 400, true));
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  sendTokenResponse(user, 200, res);

});

// @desc      Login user
// @route     POST /auth/login
// @access    Public
exports.loginUsers = asyncHandler(async (req, res, next) => {

  const { email, password } = req.body;

  // Check  if email entered and password
  if (!email || !password) {
    return next(new ErrorResponse(`Please enter email and password`, 400, true));
  }

  // Bring the user from the DB
  const user = await User.findOne({ email }).select('+password');

  // Check if the user exist
  if (!user) {
    return next(new ErrorResponse(`Invalid email or password`, 401, true));
  }

  // Check the password
  const isMatch = await user.checkPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse(`Invalid email or password`, 401, true));
  }

  sendTokenResponse(user, 200, res);

});


// @desc      Get the logined user
// @route     GET /auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {

  res.status(200).json(
    {
      success: true,
      user: req.user
    }
  );


});

// @desc      Update user details
// @route     PUT /auth/updatedetails
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {

  const filesToUpdate = {
    name: req.body.name,
    email: req.body.email
  };

  const user = await User.findByIdAndUpdate(req.user.id, filesToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json(
    {
      success: true,
      user
    }
  );


});

// @desc      Update password
// @route     GET /auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.checkPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendTokenResponse(user, 200, res);


});



// @desc      Forgot password
// @route     POST /auth/forgotpassword
// @access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse(`There is no user with this email ${req.body.email}`, 400));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();


  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {

    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    });

    res.status(200).json(
      {
        success: true,
        data: 'Email sent'
      });


  }
  catch (err) {
    //console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Email could not be sent', 500));
  }


});

// @desc      Get the logined user
// @route     PUT /auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {

  // Get hashed token
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');


  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid  token', 400));
  }

  // Set new password

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);



});

// @desc      Log user out / clear cookie
// @route     GET /auth/logout
// @access    Private
exports.logout = asyncHandler(async (req, res, next) => {

  console.log('object', 'object');
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: false
  });
  res.redirect('/');


});





const sendTokenResponse = (user, statusCode, res) => {

  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: false
  };

  if (process.env.NODE_ENV == 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .redirect('/');
};






