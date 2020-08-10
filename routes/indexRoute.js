const express = require('express');
const router = express.Router();
const ErrorResponse = require('../utils/errorResponse');
const PollModel = require('../models/PollModel');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');


// @desc    Landing page
// @route   GET /
router.get('/', asyncHandler(async (req, res, next) => {
  //render the main screen
  res.render('index');
}));

// @desc    Render the page to create poll
// @route   GET /create
router.get('/create', asyncHandler(async (req, res, next) => {
  res.render('create');
}));

// @desc    Create Poll
// @route   POST /create
router.post('/create', asyncHandler(async (req, res, next) => {
  let { title, options } = req.body;

  if (!title || !options) {
    return next(new ErrorResponse('الرجاء ارسال جميع المتطلبات', 400));
  }

  const new_poll = await PollModel.create({ title, options: JSON.parse(options) });

  res.redirect(`/${new_poll.id}/r`);
}
));

// @desc    Show the poll
// @route   GET /:id
router.get('/:id', asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    next(new ErrorResponse('الرجاء ارسال جميع المتطلبات', 400));
  }

  const poll = await PollModel.findById(id);

  // No poll and options sent with the request
  if (!poll) {
    next(new ErrorResponse('الصفحة المطلوبة غير موجودة', 404));
  }
  res.render('vote', { poll });
}));


// @desc    Add new vote to given id
// @route   POST /vote
router.post('/vote', asyncHandler(async (req, res, next) => {

  const pollID = req.body.pollID;
  const optionID = req.body.optionID;

  // No poll and options sent with the request
  if (!pollID || !optionID) {
    next(new ErrorResponse('الصفحة المطلوبة غير موجودة', 404));
  }

  // Get the option by the option id
  const poll_value = await PollModel.findOne({ "poll_list._id": optionID }, {
    'poll_list.$': 1
  });

  // Increment number of vote by 1
  let number_of_vote = poll_value.poll_list[0].numberVote + 1;



  // Add the new value of vote to the database 
  await PollModel.updateOne({ "poll_list._id": optionID }, {
    'poll_list.$.numberVote': number_of_vote
  });

  // Get the main poll
  const mainPoll = await PollModel.findById(pollID);

  // Update the total values
  await mainPoll.updateTotalVotes();

  // Update the percentage of each option
  await mainPoll.updatePercentage();

  res.redirect(`/${pollID}/r`);
}
));

// @desc    Show the result of the poll
// @route   GET /:id/r
router.get('/:id/r', asyncHandler(async (req, res, next) => {

  const id = req.params.id;

  // No id with sent with the request
  if (!id) {
    let err = new Error();
    err.name = 'NotFound';
    throw err;
  }

  // Get the poll from the id
  const poll = await PollModel.findById(id);

  // No poll with the given id
  if (!poll) {
    let err = new Error();
    err.name = 'NotFound';
    throw err;
  }

  // Sort the options so the most votes become the first result to appear
  poll.options.sort((a, b) => b.voteCount - a.voteCount);

  const pollUrl = req.protocol + '://' + req.hostname + '/' + id;

  poll.pollUrl = pollUrl;

  res.render('res', { poll_values });
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
  catch (err) {
    console.log(err);
    return next(new ErrorResponse('لم يرسل الايميل', 500));
  }
}));


module.exports = router;
