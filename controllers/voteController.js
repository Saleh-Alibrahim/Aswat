const ErrorResponse = require('../utils/errorResponse');
const PollModel = require('../models/PollModel');
const AddressModel = require('../models/AddressModel');
const checkRecaptcha = require('../utils/recaptcha');
const asyncHandler = require('../middleware/async');
const cache = require('../config/cashe.js');
const ipCheck = require('../utils/ipInfo');
const getIpAddress = require('../utils/ipAddress');

// @desc    Add new vote to given id
// @route   POST /vote
// @access    Public
exports.addVote = asyncHandler(async (req, res, next) => {

  const { pollID, optionID, token } = req.body;

  // Get the clint ip address
  const ip = await getIpAddress(req);

  console.log("exports.addVote -> ip", ip);

  // No poll and options sent with the request
  if (!pollID || !optionID || !token || !ip) {
    return next(new ErrorResponse('الرجاء ارسال جميع المتطلبات', 400, true));
  }

  // Call google API to check the token 
  if (!await checkRecaptcha(token)) {
    return next(new ErrorResponse('فشل التحقق من ان المستخدم هو انسان', 429, true));
  }

  // Get main poll
  const poll = await PollModel.findById(pollID);

  if (!poll) {
    return next(new ErrorResponse('لا يوجد تصويت بهاذه المواصفات', 400, true));
  }

  // Call ip info and check if the users using vpn or has bad ip
  if (poll.vpn) {
    if (!await ipCheck(ip)) {
      return next(new ErrorResponse(' IP Address  فشل التحقق من الـ', 429, true));
    }
  }

  // Check if the client request one ip address peer vote
  if (poll.ipAddress) {
    if (!await AddressModel.addAddress(ip, pollID)) {
      return next(new ErrorResponse('لا يمكن التصويت اكثر من مرة', 429, true));
    }
  }

  // Check if the client request only users who voted can see the result
  if (poll.hidden && !poll.ipAddress) {
    await AddressModel.addAddress(ip, pollID);
  }


  // Find the option by the id and increment it by 1 
  await PollModel.findOneAndUpdate({ "options._id": optionID },
    { $inc: { 'options.$.voteCount': 1 } });

  res.json({
    success: true,
    status: 200,
    message: 'تم تسجيل الصوت بـ نجاح'
  });

});