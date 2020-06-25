const express = require('express');
const router = express.Router();
const PollModel = require('../models/PollModel');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Landing page
// @route   GET /
router.get('/', async (req, res, next) => {
  try {
    //render the main screen
    res.render('main');
  }
  catch (err) {
    console.log(err);
    return next(new ErrorResponse('يوجد مشكلة في السيرفر', 400));
  }
});

// @desc    Landing page
// @route   POST /create_poll
router.post('/create_poll', async (req, res, next) => {
  try {
    const { title, poll_list } = req.body;
    const new_poll = await PollModel.create({ title: title, poll_list: poll_list });
    const results = { id: new_poll.id, success: true };
    res.status(201).json(results);
  }
  catch (err) {
    console.log(err);
    return next(new ErrorResponse('لا يمكن انشاء التصويت حاول في وقت اخر', 401));
  }
});

// @desc    Show the result
// @route   GET /vote/:id
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const poll_values = await PollModel.findById(id);
    if (!poll_values) { throw new Error(404); }
    res.render('vote', { poll_values: poll_values });
  }
  catch (err) {
    console.log(err);
    return next(new ErrorResponse('لا يوجد تصويت بهذا الرقم  الرجاء التأكد من الرابط المدخل', 404));
  }

});


// @desc    Add new vote to given id
// @route   POST /add_vote
router.post('/add_vote', async (req, res) => {
  try {
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
  catch (err) {
    console.log(err);
    return next(new ErrorResponse('لا يوجد تصويت بهذا الرقم  الرجاء التأكد من الرابط المدخل', 404));
  }
});

router.get('/:id/r', async (req, res) => {
  try {
    const id = req.params.id;
    // get the item with the given id
    const poll_values = await PollModel.findById(id);

    //sort the items so the most votes become the first result to apper
    poll_values.poll_list.sort((a, b) => b.numberVote - a.numberVote);

    res.render('res', { poll_values: poll_values });
  }
  catch (err) {
    console.log(err);
    return next(new ErrorResponse('لا يوجد تصويت بهذا الرقم  الرجاء التأكد من الرابط المدخل', 404));
  }
});





module.exports = router;
