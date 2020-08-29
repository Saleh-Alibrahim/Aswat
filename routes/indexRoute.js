const express = require('express');
const router = express.Router();
const ErrorResponse = require('../utils/errorResponse');
const PollModel = require('../models/PollModel');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const checkRecaptcha = require('../utils/recaptcha');


// @desc    Render the main page
// @route   GET /
router.get('/', asyncHandler(async (req, res, next) => {
  res.render('index');
}));

// @desc    Render the create poll page
// @route   GET /create
router.get('/create', asyncHandler(async (req, res, next) => {
  res.render('create');
}));

// @desc    Create Poll
// @route   POST /create
router.post('/create', asyncHandler(async (req, res, next) => {


  const { title, options } = req.body;

  // Check if the title and at least  2 options is sent with the request
  if (!title.trim() || options.length < 2) {
    return next(new ErrorResponse('الرجاء ارسال جميع المتطلبات', 400));
  }

  // Create new Poll
  const newPoll = await PollModel.create({ title, options: JSON.parse(options) });

  //res.redirect(`/${newPoll.id}/r`);

  res.status(200).json({
    success: true,
    id: newPoll.id
  });
}
));

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

  // No poll and options sent with the request
  if (!poll) {
    return next(new ErrorResponse('الصفحة المطلوبة غير موجودة', 404));
  }
  res.render('vote', { poll });
}));


// @desc    Add new vote to given id
// @route   POST /vote
router.post('/vote', asyncHandler(async (req, res, next) => {

  const { pollID, optionID, token } = req.body;

  // No poll and options sent with the request
  if (!pollID || !optionID || !token) {
    return next(new ErrorResponse('الرجاء ارسال جميع المتطلبات', 400));
  }

  try {
    const data = await checkRecaptcha(token);
    console.log("data", data)

    // Check if the recaptcha failed
    if (data.success == false || data.score < 0.3) {
      return next(new ErrorResponse('فشل التحقق من ان المستخدم هو انسان', 429));
    }


    // Find the option by the id and increment it by 1 
    await PollModel.findOneAndUpdate({ "options._id": optionID }, { $inc: { 'options.$.voteCount': 1 } });

    // Get the main poll
    const mainPoll = await PollModel.findById(pollID);

    // Update the total values
    await mainPoll.updateTotalVotes();


    res.redirect(`/${pollID}/r`);
  }
  catch (e) {
    return next(new ErrorResponse(500));
  }
}
));

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
}
));

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
