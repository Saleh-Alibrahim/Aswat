const crypto = require('crypto');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const UserModel = require('../models/UserModel');
const PollModel = require('../models/PollModel');
const ErrorResponse = require('../utils/errorResponse');
const ms = require('ms');

// @desc      Render the register page
// @route     GET /auth/register
// @access    Public
exports.getRegisterView = asyncHandler(async (req, res, next) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('auth/registerView');
});

// @desc      Render the login page
// @route     GET /auth/login
// @access    Public
exports.getLoginView = asyncHandler(async (req, res, next) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('auth/loginView');
});

// @desc      Register user
// @route     POST /auth/register
// @access    Public
exports.registerUsers = asyncHandler(async (req, res, next) => {

  if (req.user) {
    return res.redirect('/');
  }
  let { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(new ErrorResponse(`الرجاء ادخال الاسم و الايميل و كلمة المرور`, 400, true));
  }
  email = email.toLowerCase();

  // Check if the email exists
  const userCheck = await UserModel.findOne({ email: email });

  if (userCheck) {
    return next(new ErrorResponse(`هذا المستخدم موجود من قبل`, 400, true));
  }

  // Create user in the db
  const user = await UserModel.create({
    username,
    email,
    password,
  });

  await convertCookieToLogin(req, res, user._id);

  sendTokenResponse(user, 200, res, 'تم التسجيل بنجاح', true);

});

// @desc      Login user
// @route     POST /auth/login
// @access    Public
exports.loginUsers = asyncHandler(async (req, res, next) => {

  if (req.user) {
    return res.redirect('/');
  }

  let { email, password, rememberMe } = req.body;

  // Check  if email entered and password
  if (!email || !password) {
    return next(new ErrorResponse(`الرجاء ادخال الايميل و كلمة المرور`, 400, true));
  }
  email = email.toLowerCase();

  // Bring the user from the DB
  const user = await UserModel.findOne({ email }).select('+password');

  // Check if the user exist
  if (!user) {
    return next(new ErrorResponse(`خطأ في الايميل او كلمة المرور`, 400, true));
  }

  // Check the password if match or not
  const isMatch = await user.checkPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse(`خطأ في الايميل او كلمة المرور`, 400, true));
  }

  await convertCookieToLogin(req, res, user._id);

  sendTokenResponse(user, 200, res, 'مرحبا بعودتك', rememberMe);

});



// @desc      Forgot password
// @route     POST /auth/forgotpassword
// @access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {

  const email = req.body.email.toLowerCase();

  const user = await UserModel.findOne({ email: email });

  if (!user) {
    return next(new ErrorResponse(`لا يوجد حساب بهذا الايميل `, 400, true));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();


  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/auth/resetpassword/${resetToken}`;

  const message = `أنت تتلقى هذا البريد الإلكتروني لأنك (أو أي شخص آخر) طلبت إعادة تعيين كلمة المرور \n\n  ${resetUrl} يمكنك إستعادة حسابك من هنا`;

  try {

    await sendEmail({
      email: user.email,
      subject: 'إستعادة كلمة المرور',
      message
    }, true);

    res.status(200).json(
      {
        success: true,
        message: 'تم إرسال الايميل بـ نجاح'
      });


  }
  catch (err) {
    //console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('لا يمكن إرسال الإيميل في الوقت الحالي', 500, true));
  }


});

// @desc      Reset password with the token user
// @route     PUT /auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {

  // Get hashed token
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');


  const user = await UserModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('لا يوجد حساب بهذا الحساب ', 400, true));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  await convertCookieToLogin(req, res, user._id);

  sendTokenResponse(user, 200, res, 'تم تغيير كلمة المرور بنجاح', true);

});

// @desc      Render the reset password view
// @route     GET /auth/resetpassword/:resettoken
// @access    Public
exports.getResetPasswordView = asyncHandler(async (req, res, next) => {

  // Get hashed token
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');


  const user = await UserModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('لا يوجد حساب بهذا الرمز', 400));
  }
  else {
    res.render('auth/resetPasswordView');
  }

});

// @desc      Log user out / clear cookie
// @route     GET /auth/logout
// @access    Private
exports.logout = asyncHandler(async (req, res, next) => {
  await res.clearCookie('token');
  res.redirect('/');

});


// @desc      Render the forget password page
// @route     GET /auth/forgotpassword
// @access    Public
exports.getforgotPasswordView = asyncHandler(async (req, res, next) => {
  res.render('auth/forgotPasswordView');
});

// @desc      Update password
// @route     GET /api/v1/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {

  const { oldPassword, newPassword } = req.body;

  const user = await UserModel.findById(req.user.id).select('+password');

  if (!(await user.checkPassword(req.body.oldPassword))) {
    return next(new ErrorResponse('خطأ في كلمة المرور السابقة', 401, true));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendTokenResponse(user, 200, res, 'تم تغيير كلمة المرور بنجاح', true);

});

// @desc      Update user details
// @route     PUT /api/v1/auth/updatedetails
// @access    Private
exports.updateDetails = async (req, res, next) => {

  try {

    const filesToUpdate = {
      username: req.body.username,
      email: req.body.email
    };

    const user = await UserModel.findByIdAndUpdate(req.user.id, filesToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json(
      {
        success: true,
        message: 'تم تعديل البيانات'
      }
    );
  }
  catch (e) {
    if (e.code == 11000) {
      return next(new ErrorResponse('هذا الايميل موحود من قبل', 401, true));
    }
  }


};

// @desc      Render update password view
// @route     GET /api/v1/auth/updatepassword
// @access    Private
exports.getUpdatePasswordView = asyncHandler(async (req, res, next) => {

  res.render('auth/updatePasswordView', { user: req.user });

});





const sendTokenResponse = (user, statusCode, res, msg, rememberMe) => {

  const duration = rememberMe ? ms('30d') : ms('1d');

  // Create token
  const token = user.getSignedJwtToken(duration);

  const options = {
    expires: new Date(Date.now() + duration),
    httpOnly: false
  };

  if (process.env.NODE_ENV == 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      message: msg
    });
};

const convertCookieToLogin = async (req, res, userID) => {

  const adminID = req.cookies.adminID;
  if (adminID) {
    await PollModel.updateMany({ adminID }, { adminID: userID });
  }
  await res.clearCookie('adminID');
}






