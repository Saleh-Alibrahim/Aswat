const express = require('express');
const router = express.Router();
const ErrorResponse = require('../utils/errorResponse');
const PollModel = require('../models/PollModel');
const asyncHandler = require('../middleware/async');
const checkRecaptcha = require('../utils/recaptcha');
const checkIP = require('../utils/ipInfo');


// @desc    Add new vote to given id
// @route   POST /vote
router.post('/', asyncHandler(async (req, res, next) => {

  const { pollID, optionID, token, ip } = req.body;

  // No poll and options sent with the request
  if (!pollID || !optionID || !token) {
    return next(new ErrorResponse('الرجاء ارسال جميع المتطلبات', 400));
  }

  try {

    // Call google API to check the token 
    const recaptcha = await checkRecaptcha(token);

    // Check if the recaptcha failed
    if (!recaptcha) {
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



module.exports = router;
