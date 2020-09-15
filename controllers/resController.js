const ErrorResponse = require('../utils/errorResponse');
const PollModel = require('../models/PollModel');
const AddressModel = require('../models/AddressModel');
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
  const poll = await PollModel.findById(id);

  // No poll with the given id
  if (!poll) {
    return next(new ErrorResponse('الصفحة المطلوبة غير موجودة', 404));
  }

  // Check if you need to vote before access the result
  if (poll.hidden) {

    // Get the clint ip address
    const ip = await getIpAddress(req);

    // Check if the user in the database
    // Or it's the poll admin
    // If either false redirect to the vote page
    if (
      await !AddressModel.getAddress(ip, id) ||
      await !loginIsAdmin(req, poll) ||
      await !cookieIsAdmin(req, poll)
    ) {
      return res.redirect('/' + id);
    }
  }

  // Sort the options so the most votes become the first result to appear
  poll.options.sort((a, b) => b.voteCount - a.voteCount);

  // Get the total vote
  await poll.getTotalVotes();

  // Add percentage to each option
  await poll.addPercentageToOptions();

  // Add the poll url to the result to make it easy to copy it
  const pollUrl = req.protocol + '://' + req.hostname + '/' + id;

  poll.pollUrl = pollUrl;

  res.render('resView', { poll });
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
  // Check if user is logged in
  if (req.cookies.adminList) {
    const adminList = req.cookies.adminList;
    if (adminList.includes(poll.adminID)) {
      return true;
    }
    else {
      return false;
    }
  }
  else
    return false;
};

