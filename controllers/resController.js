const ErrorResponse = require('../utils/errorResponse');
const PollModel = require('../models/PollModel');
const AddressModel = require('../models/AddressModel');
const QuestionsModel = require('../models/QuestionsModel');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const getIpAddress = require('../utils/ipAddress');




// @desc    Show the result of the poll
// @route   GET /:id/r
// @access    Public
exports.getPollResult = asyncHandler(async (req, res, next) => {

  const id = req.params.id;

  // No id with sent with the request
  if (!id) {
    return next(new ErrorResponse('الرجاء ارسال جميع المتطلبات', 400));
  }


  // Get the poll from the id
  const poll = await PollModel.findById(id).select('+adminID');

  // No poll with the given id
  if (!poll) {
    return next(new ErrorResponse('الصفحة المطلوبة غير موجودة', 404));
  }

  const cookie = await cookieIsAdmin(req, poll);
  const login = await loginIsAdmin(req, poll);


  // Check if you need to vote before access the result
  if (poll.hidden != 0) {

    // Get the clint ip address
    const ip = await getIpAddress(req);
    if (poll.hidden == 1) {
      // Check if the user in the database
      // Or it's the poll admin
      // If either false redirect to the vote page
      if (!await AddressModel.getAddress(ip, id)) {
        if (!cookie && !login) {
          return res.redirect('/' + id);
        }
      }
    }
    else {
      if (!cookie && !login) {
        return next(new ErrorResponse('لا يمكن الإطلاع على النتائج في هذا التصويت', 401));
      }
    }

  }
  // If user request answers 
  if (poll.question && (cookie || login)) {
    const question = await QuestionsModel.findOne({ _id: poll._id, adminID: poll.adminID });
    poll.answers = question.answers;
  }

  // Sort the options so the most votes become the first result to appear
  poll.options.sort((a, b) => b.voteCount - a.voteCount);

  // Add percentage to each option
  await poll.addPercentageToOptions();



  poll.admin = cookie || login;

  // Add the poll url to the result to make it easy to copy it
  const pollUrl = req.protocol + '://' + req.hostname + '/' + id;

  poll.pollUrl = pollUrl;


  res.render('resView', { poll });
});


// @desc    Check if the user can access the result page
// @route   GET /:id/resultAccess
// @access    Public
exports.getResultAccses = asyncHandler(async (req, res, next) => {

  const id = req.params.id;

  // No id with sent with the request
  if (!id) {
    return next(new ErrorResponse('الرجاء ارسال جميع المتطلبات', 400, true));
  }


  // Get the poll from the id
  const poll = await PollModel.findById(id);

  const cookie = await cookieIsAdmin(req, poll);
  const login = await loginIsAdmin(req, poll);

  // No poll with the given id
  if (!poll) {
    return next(new ErrorResponse('الصفحة المطلوبة غير موجودة', 404, true));
  }

  // Get the clint ip address
  const ip = await getIpAddress(req);
  if (poll.hidden == 1) {
    // Check if the user in the database
    // Or it's the poll admin
    // If either false redirect to the vote page
    if (!await AddressModel.getAddress(ip, id)) {
      if (!cookie && !login) {
        return res.status(401).json({ success: false, msg: 'تحتاج لتصويت للوصول الى النتائج' });
      }
    }
  }
  else if (poll.hidden == 2) {
    if (!cookie && !login) {
      return res.status(401).json({ success: false, msg: 'لا يمكن الإطلاع على النتائج في هذا التصويت' });
    }
  }
  res.status(200).json({ success: true });

});




const loginIsAdmin = async (req, poll) => {

  // Check if user is logged in
  if (req.user) {
    if (req.user._id == poll.adminID) {
      return true;
    }
    else {
      return false;
    }
  } else
    return false;
};


const cookieIsAdmin = async (req, poll) => {

  const adminID = req.cookies.adminID;
  // Check if user is logged in
  if (adminID) {
    if (adminID == poll.adminID) {
      return true;
    }
    else {
      return false;
    }
  }
  else
    return false;
};

