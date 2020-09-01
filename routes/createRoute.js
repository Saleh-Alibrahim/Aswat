const express = require('express');
const router = express.Router();
const ErrorResponse = require('../utils/errorResponse');
const PollModel = require('../models/PollModel');
const asyncHandler = require('../middleware/async');


// @desc    Render the create poll page
// @route   GET /create
router.get('/', asyncHandler(async (req, res, next) => {
  res.render('createView');
}));

// @desc    Create Poll
// @route   POST /create
router.post('/', asyncHandler(async (req, res, next) => {

  const { title, options, ip, vpn } = req.body;


  // Check if the title and at least  2 options is sent with the request
  if (!title.trim() || options.length < 2) {
    return next(new ErrorResponse('الرجاء ارسال جميع المتطلبات', 400));
  }


  // Check if the creator required the name from the voters
  // let question;
  // if (name) { question = 'هذا التصويت يتطلب ادخال الاسم'; }

  // Create new Poll
  const newPoll = await PollModel.create({ title, options: JSON.parse(options), ipAddress: ip, vpn: vpn });


  res.status(200).json({
    success: true,
    id: newPoll.id
  });

}));






module.exports = router;
