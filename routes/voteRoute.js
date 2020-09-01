const express = require('express');
const router = express.Router();
const ErrorResponse = require('../utils/errorResponse');
const PollModel = require('../models/PollModel');
const AddressModel = require('../models/AddressModel');
const asyncHandler = require('../middleware/async');
const checkRecaptcha = require('../utils/recaptcha');
const checkIP = require('../utils/ipInfo');


// @desc    Add new vote to given id
// @route   POST /vote
router.post('/', asyncHandler(async (req, res, next) => {

  const { pollID, optionID, token, ip } = req.body;

  // No poll and options sent with the request
  if (!pollID || !optionID || !token || !ip) {
    return next(new ErrorResponse('الرجاء ارسال جميع المتطلبات', 400));
  }

  try {

    // Get the main poll
    const mainPoll = await PollModel.findById(pollID);


    // Check if the client request if the users used vpn
    if (!mainPoll.vpn) {

      // Call ip info and check if the users using vpn
      const checkVPN = await checkIP(ip);

      if (!checkVPN) {
        return next(new ErrorResponse(429, 'فشل التحقق من  ip address'));
      }

    }

    // Check if the client request one ip address peer vote
    if (mainPoll.ipAddress) {

      const ipExist = await checkAddressModel(ip, pollID);

      if (!ipExist) {
        return next(new ErrorResponse('لا يمكن التصويت اكثر من مرة', 429));
      }

    }


    // Call google API to check the token 
    const recaptcha = await checkRecaptcha(token);

    // Check if the recaptcha failed
    if (!recaptcha) {
      return next(new ErrorResponse('فشل التحقق من ان المستخدم هو انسان', 429));
    }

    // Find the option by the id and increment it by 1 
    await PollModel.findOneAndUpdate({ "options._id": optionID }, { $inc: { 'options.$.voteCount': 1 } });

    // Update the total values
    await mainPoll.updateTotalVotes();


    res.redirect(`/${pollID}/r`);
  }
  catch (e) {
    console.log(e);
    return next(new ErrorResponse(500));
  }
}
));


const checkAddressModel = async (ip, pollID) => {

  // Check if ip address exist in the db
  const address = await AddressModel.findOne({ ipAddress: ip, pollID: pollID });

  console.log('address :>> ', address);
  if (address) {
    return false;
  }
  else {
    await AddressModel.create({ ipAddress: ip, pollID: pollID });
    return true;
  }
};


module.exports = router;
