const ErrorResponse = require('../utils/errorResponse');
const PollModel = require('../models/PollModel');
const checkRecaptcha = require('../utils/recaptcha');
const asyncHandler = require('../middleware/async');
const cache = require('../config/cashe.js');
const ipCheck = require('../utils/ipInfo');

// @desc    Add new vote to given id
// @route   POST /vote
exports.addVote = asyncHandler(async (req, res, next) => {

  const { pollID, optionID, token, ip } = req.body;

  // No poll and options sent with the request
  if (!pollID || !optionID || !token || !ip) {
    return next(new ErrorResponse('الرجاء ارسال جميع المتطلبات', 400));
  }

  // Call google API to check the token 
  const recaptcha = await checkRecaptcha(token);

  // Check if the recaptcha failed
  if (!recaptcha) {
    return next(new ErrorResponse('فشل التحقق من ان المستخدم هو انسان', 429));
  }


  // Get the main poll
  const mainPoll = await PollModel.findById(pollID);

  // Check if the client request if the users used vpn
  if (mainPoll.vpn) {

    // Call ip info and check if the users using vpn
    const checkVPN = await ipCheck(ip);

    if (!checkVPN) {
      return next(new ErrorResponse(429, 'فشل التحقق من  ip address'));
    }

  }

  // Check if the client request one ip address peer vote
  if (mainPoll.ipAddress) {

    const ipExist = await cache.cacheIP(ip, pollID);

    if (!ipExist) {
      return next(new ErrorResponse('لا يمكن التصويت اكثر من مرة', 429));
    }

  }



  // Find the option by the id and increment it by 1 
  await PollModel.findOneAndUpdate({ "options._id": optionID }, { $inc: { 'options.$.voteCount': 1 } });

  // Get the  poll after the update
  const pollAfterUpdate = await PollModel.findById(pollID);

  // Update the total values
  await pollAfterUpdate.updateTotalVotes();


  res.redirect(`/${pollID}/r`);

});

const IpAddressExists = async (safe) => {

}
