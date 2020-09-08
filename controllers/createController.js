const ErrorResponse = require('../utils/errorResponse');
const PollModel = require('../models/PollModel');
const UserModel = require('../models/UserModel');
const asyncHandler = require('../middleware/async');


// @desc    Render the create poll page
// @route   GET /create
// @access    Public
exports.getCreateView = asyncHandler(async (req, res, next) => {
  res.render('createView');
});

// @desc    Create Poll
// @route   POST /create
// @access    Public
exports.createPoll = asyncHandler(async (req, res, next) => {

  const { title, options, ip, vpn, hidden } = req.body;

  // Check if the title and at least  2 options is sent with the request
  if (!title.trim() || options.length < 2) {
    return next(new ErrorResponse('الرجاء ارسال جميع المتطلبات', 400, true));
  }

  // Check if login user created the poll of guest if guest generate token
  const pollToken = req.user ? req.user._id : await UserModel.generatePollToken();

  // Create new Poll
  const newPoll = await PollModel.create({
    title, options: JSON.parse(options),
    ipAddress: ip, vpn: !vpn, hidden, pollToken
  });

  await getPollToken(req, res, pollToken);


  res.json({
    success: true,
    status: 200,
    id: newPoll.id,
    message: 'تم إنشاء التصويت بـ نجاح'
  });

});

const getPollToken = async (req, res, pollToken) => {

  // Get the admin token
  const tokenList = req.cookies.pollToken || [];

  const options = {
    expires: new Date(Date.now() + '30d' * 24 * 60 * 60 * 1000),
    httpOnly: false
  };

  if (process.env.NODE_ENV == 'production') {
    options.secure = true;
  }

  tokenList.push(pollToken);

  res.cookie('pollToken', tokenList, options);

}



