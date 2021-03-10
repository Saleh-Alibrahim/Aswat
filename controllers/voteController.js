const ErrorResponse = require('../utils/errorResponse');
const PollModel = require('../models/PollModel');
const AddressModel = require('../models/AddressModel');
const QuestionsModel = require('../models/QuestionsModel');
const checkRecaptcha = require('../utils/recaptcha');
const asyncHandler = require('../middleware/async');
const cache = require('../config/cashe.js');
const ipCheck = require('../utils/ipInfo');
const getIpAddress = require('../utils/ipAddress');

// @desc    Add new vote to given id
// @route   POST /vote
// @access    Public
exports.addVote = asyncHandler(async (req, res, next) => {

  const { pollID, optionID, token, answer } = req.body;

  // Get the clint ip address
  const ip = await getIpAddress(req);

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

  if (poll.question && !answer.trim()) {
    return next(new ErrorResponse('الرجاء الإجابة على السؤال', 400, true));
  }

  // Check if the client request one ip address peer vote
  if (poll.ipAddress) {
    if (!await AddressModel.addAddress(ip, pollID)) {
      return next(new ErrorResponse('لا يمكن التصويت اكثر من مرة', 429, true));
    }
  }

  // Check if the client request only users who voted can see the result
  if (poll.hidden != 0 && !poll.ipAddress) {
    await AddressModel.addAddress(ip, pollID);
  }

  // Check if the client request answer to his question 
  // if yes save the the answer
  if (poll.question) {

    const question = await QuestionsModel.findById(pollID);

    let name = await PollModel.findOne({ "options._id": optionID }, { "options.$": 1 });
    name = name.options[0].name

    question.answers.push({ name, answer });

    await question.save();

  }




  // Find the option by the id and increment it by 1 
  const newPoll = await PollModel.findOneAndUpdate({ "options._id": optionID },
    { $inc: { 'options.$.voteCount': 1 } }, { new: true });


  // add total vote
  await newPoll.addTotalVote();



  res.json({
    success: true,
    status: 200,
    message: 'تم تسجيل الصوت بـ نجاح'
  });

});