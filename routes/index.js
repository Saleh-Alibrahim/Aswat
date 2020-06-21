const express = require('express');
const router = express.Router();
const PollModel = require('../models/PollModel')

// @desc    Landing page
// @route   GET /
router.get('/', async (req, res) => {
  res.render('main');
});

// @desc    Landing page
// @route   POST /create_poll
router.post('/create_poll', async (req, res, next) => {
  const { title, poll_list } = req.body;
  const new_poll = await PollModel.create({ title: title, poll_list: poll_list });
  res.redirect(`/result/${new_poll.id}`);
});

router.get('/result/:id', async (req, res) => {
  const id = req.params.id;
  console.log('id :>> ', id);
  res.render('main');
});



module.exports = router;
