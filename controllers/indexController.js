const ErrorResponse = require('../utils/errorResponse');
const PollModel = require('../models/PollModel');
const AddressModel = require('../models/AddressModel');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const getIpAddress = require('../utils/ipAddress');


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

  // Check if the user request create poll options
  if (id == 'create') {
    return next();
  }

  // Find the poll with sent id
  const poll = await PollModel.findById(id);

  // No poll with given id
  if (!poll) {
    return next(new ErrorResponse('الصفحة المطلوبة غير موجودة', 404));
  }
  res.render('voteView', { poll });
});

// @desc    Show the result of the poll
// @route   GET /:id/r
// @access    Public
exports.getPollResult = asyncHandler(async (req, res, next) => {

  const id = req.params.id;

  // No id with sent with the request
  if (!id) {
    return next(new ErrorResponse('الرجاء ارسال جميع المتطلبات', 400));
  }



  // Get the poll from the id
  const poll = await PollModel.findById(id);

  // No poll with the given id
  if (!poll) {
    return next(new ErrorResponse('الصفحة المطلوبة غير موجودة', 404));
  }

  // Check if you need to vote before access the result
  if (poll.hidden) {

    // Get the clint ip address
    const ip = await getIpAddress(req);
    if (! await AddressModel.getAddress(ip, id)) {
      return res.redirect('/' + id);
    }
  }

  // Sort the options so the most votes become the first result to appear
  poll.options.sort((a, b) => b.voteCount - a.voteCount);

  // Get the total vote
  await poll.getTotalVotes();

  // Add percentage to each option
  await poll.addPercentageToOptions();

  // Add the poll url to the result to make it easy to copy it
  const pollUrl = req.protocol + '://' + req.hostname + '/' + id;

  poll.pollUrl = pollUrl;

  res.render('resView', { poll });
});


// @desc    Send email
// @route   POST /mail
// @access    Public
exports.sendEmail = ('/mail', asyncHandler(async (req, res, next) => {

  const { email, subject, message } = req.body;

  try {
    await sendEmail({
      email,
      subject,
      message
    });

    res.status(200).json(
      {
        success: true,
        data: 'Email sent'
      });
  }
  catch (e) {
    return next(new ErrorResponse(500, 'مشكلة في السيرفر', true));
  }
}
));


