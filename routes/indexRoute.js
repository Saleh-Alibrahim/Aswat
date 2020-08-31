const express = require('express');
const router = express.Router();
const ErrorResponse = require('../utils/errorResponse');
const PollModel = require('../models/PollModel');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');


// @desc    Render the main page
// @route   GET /
router.get('/', asyncHandler(async (req, res, next) => {
  res.render('index');
}));

// @desc    Show the poll
// @route   GET /:id
router.get('/:id', asyncHandler(async (req, res, next) => {
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
  res.render('vote', { poll });
}));

// @desc    Show the result of the poll
// @route   GET /:id/r
router.get('/:id/r', asyncHandler(async (req, res, next) => {

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


  // Sort the options so the most votes become the first result to appear
  poll.options.sort((a, b) => b.voteCount - a.voteCount);

  const totalVote = poll.total;

  // Add percentage to each option
  poll.options.forEach(option => {
    option.percentage = (option.voteCount / totalVote * 100).toFixed(2);
    if (isNaN(option.percentage)) {
      option.percentage = 0;
    }
  });

  // Add the poll url to the result to make it easy to copy it
  const pollUrl = req.protocol + '://' + req.hostname + '/' + id;

  poll.pollUrl = pollUrl;

  res.render('res', { poll });
}));



// @desc    Send email
// @route   POST /mail
router.post('/mail', asyncHandler(async (req, res, next) => {

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
    return next(new ErrorResponse(500));
  }
}
));



module.exports = router;
