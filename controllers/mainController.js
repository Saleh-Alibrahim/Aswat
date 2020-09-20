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
    return next(new ErrorResponse(500, 'مشكلة في السيرفر', true));
  }
}));


// @desc    Render the dashboard page
// @route   GET /dashboard
// @access    Public
exports.dashboard = asyncHandler(async (req, res, next) => {

  let pollList;
  if (req.user && req.cookies.adminID) {
    pollListOne = await PollModel.find({ adminID: req.user._id });
    pollListTwo = await PollModel.find({ adminID: req.cookies.adminID });
    pollList = pollListOne.concat(pollListTwo);
  }
  else {
    const adminID = req.user ? req.user._id : req.cookies.adminID;
    pollList = await PollModel.find({ adminID });
  }

  const url = req.protocol + '://' + req.hostname + ':' + process.env.PORT;

  res.render('dashboardView', { pollList, url });

});


