const express = require('express');
const router = express.Router();
const PollModel = require('../models/PollModel')

// @desc    Landing page
// @route   GET /
router.get('/', async (req, res) => {
  try {
    //render the main screen
    res.render('main');
  }
  catch (e) {
    console.log(e);
    res.status(500).json({ success: false });
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
  catch (e) {
    console.log(e);
    res.status(500).json({ success: false });
  }
});

// @desc    Show the result
// @route   GET /vote/:id
router.get('/poll/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const poll_values = await PollModel.findById(id);
    res.render('vote', { poll_values: poll_values });
  }
  catch (e) {
    console.log(e);
    res.status(404).json({ success: false });
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
    const updateVote = await PollModel.updateOne({ "poll_list._id": id }, {
      'poll_list.$.numberVote': number_of_vote
    });
    res.status(200).json({ success: true });
    //res.render('vote', { poll_values: poll_values });
  }
  catch (e) {
    console.log(e);
    res.status(500).json({ success: false });
  }
});

router.get('/poll/:id/res', async (req, res) => {
  try {
    const id = req.params.id;
    const poll_values = await PollModel.findById(id);
    res.render('res', { poll_values: poll_values });
  }
  catch (e) {
    console.log(e);
    res.status(404).json({ success: false });
  }
});





module.exports = router;
