const ErrorResponse = require('../utils/errorResponse');
const PollModel = require('../models/PollModel');
const UserModel = require('../models/UserModel');
const QuestionsModel = require('../models/QuestionsModel');
const asyncHandler = require('../middleware/async');
const ms = require('ms');

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

  const { title, options, ip, vpn, hidden, question } = req.body;

  // Check if the title and at least  2 options is sent with the request
  if (!title.trim() || options.length < 2) {
    return next(new ErrorResponse('الرجاء ارسال جميع المتطلبات', 400, true));
  }

  // Check if login user created this poll or a guest
  // If guest generate token
  let adminID;

  if (!(req.user || req.cookies.adminID)) {
    adminID = await UserModel.generateAdminToken();
    await createAdminToken(res, adminID);
  }
  else {
    adminID = req.user ? req.user._id : req.cookies.adminID;
  }



  // Create new Poll
  const newPoll = await PollModel.create({
    adminID, title, options: JSON.parse(options),
    ipAddress: ip, vpn: !vpn, hidden, question
  });

  if (hidden != 0 || ipAddress) { await this.model('Address').create({ _id: this._id }); }
  if (question) { await this.model('Questions').create({ _id: this._id, adminID: this.adminID }); }


  res.json({
    success: true,
    status: 200,
    id: newPoll.id,
    message: 'تم إنشاء التصويت بـ نجاح'
  });

});

const createAdminToken = async (res, adminID) => {


  const options = {
    expires: new Date(Date.now() + ms('30d')),
    httpOnly: false
  };

  if (process.env.NODE_ENV == 'production') {
    options.secure = true;
  }

  res.cookie('adminID', adminID, options);

};



