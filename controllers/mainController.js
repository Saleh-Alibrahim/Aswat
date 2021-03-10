const ErrorResponse = require('../utils/errorResponse');
const PollModel = require('../models/PollModel');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');


// @desc    Render the main page
// @route   GET /
// @access    Public
exports.getMainView = asyncHandler(async (req, res, next) => {
  res.render('indexView');
});

// @desc    Show the poll
// @route   GET /:id
// @access    Public
exports.getPoll = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  // Check if id is sent with request
  if (!id) {
    return next(new ErrorResponse('الرجاء ارسال جميع المتطلبات', 400));
  }

  // Find the poll with sent id
  const poll = await PollModel.findById(id);

  // No poll with given id
  if (!poll) {
    return next(new ErrorResponse('الصفحة المطلوبة غير موجودة', 404));
  }
  res.render('voteView', { poll });
});

// @desc    Delete the poll
// @route   Delete /:id
// @access    Private
exports.deletePoll = asyncHandler(async (req, res, next) => {

  const id = req.params.id;

  // Check if id is sent with request
  if (!id) {
    return next(new ErrorResponse('الرجاء ارسال جميع المتطلبات', 400, true));
  }

  // Find the poll with sent id
  const poll = await PollModel.findOne({ _id: id }).select('+adminID');

  // No poll with given id
  if (!poll) {
    return next(new ErrorResponse('لا يوجد تصويت بهذا الايدي', 404, true));
  }

  const adminID = req.user ? req.user._id : req.cookies.adminID;

  if (poll.adminID != adminID) {
    return next(new ErrorResponse('غير مسموح لك بحذف هذا التصويت', 401, true));
  }

  await poll.deleteOne();

  res.json({ success: true });
});

// @desc    Send email
// @route   POST /mail
// @access    Public
exports.sendEmail = ('/mail', asyncHandler(async (req, res, next) => {

  const { email, subject, message } = req.body;

  try {
    await sendEmail({ email, subject, message });

    res.status(200).json({
      success: true,
      data: 'Email sent'
    });
  }
  catch (e) {
    console.log(e);
    return next(new ErrorResponse(500, 'مشكلة في السيرفر', true));
  }
}));


// @desc    Render the dashboard page
// @route   GET /dashboard
// @access    Public
exports.dashboard = asyncHandler(async (req, res, next) => {

  const adminID = req.user ? req.user._id : req.cookies.adminID;

  const pollList = await PollModel.find({ adminID });

  if (!pollList) {
    return next(new ErrorResponse('لا يوجد اصوات لهذا المستخدم', 401));
  }

  let url = req.protocol + '://' + req.hostname;

  if (process.env.NODE_ENV === 'development') {
    url = url + ':' + process.env.PORT;
  }

  res.render('dashboardView', { pollList, url, user: req.user });

});


// @desc    Render the settings page
// @route   GET /settings
// @access    Private
exports.settings = asyncHandler(async (req, res, next) => {

  let url = req.protocol + '://' + req.hostname;

  if (process.env.NODE_ENV === 'development') {
    url = url + ':' + process.env.PORT;
  }

  res.render('settingsView', { user: req.user, url });

});


