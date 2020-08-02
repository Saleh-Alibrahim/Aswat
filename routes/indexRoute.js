const express = require('express');
const router = express.Router();
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
}
));

// @desc    Create Poll
// @route   POST /create
router.post('/create', asyncHandler(async (req, res, next) => {
  let { title, poll_list } = req.body;
  poll_list = JSON.parse(poll_list);
  const new_poll = await PollModel.create({ title: title, poll_list: poll_list });
  res.redirect(`/${new_poll.id}`);
}
));

// @desc    Show the poll
// @route   GET /:id
router.get('/:id', asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!id) { return res.end(); }
  const poll_values = await PollModel.findById(id);

  if (!poll_values) {
    let err = new Error();
    err.name = 'NotFound';
    throw err;
  }
  res.render('vote', { poll_values: poll_values });
}));


// @desc    Add new vote to given id
// @route   POST /vote
router.post('/vote', asyncHandler(async (req, res, next) => {
  const id = req.body.id;
  // get the item with the given id
  const poll_value = await PollModel.findOne({ "poll_list._id": id }, {
    'poll_list.$': 1
  });

  // increment number of vote by 1
  let number_of_vote = poll_value.poll_list[0].numberVote + 1;

  // update the database and add the new vote
  await PollModel.updateOne({ "poll_list._id": id }, {
    'poll_list.$.numberVote': number_of_vote
  });
  res.status(200).json({ success: true });
}
));

// @desc    Show the result of the poll
// @route   GET /:id/r
router.get('/:id/r', asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!id) { return res.end(); }
  // get the item with the given id
  const poll_values = await PollModel.findById(id);

  if (!poll_values) {
    let err = new Error();
    err.name = 'NotFound';
    throw err;
  }

  //sort the items so the most votes become the first result to appear
  poll_values.poll_list.sort((a, b) => b.numberVote - a.numberVote);
  res.render('res', { poll_values: poll_values });
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
