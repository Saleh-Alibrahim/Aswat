const ErrorResponse = require('../utils/errorResponse');
const redis = require('redis');
const asyncHandler = require('./async');
let client;

exports.connectCache = () => {
  // create cache client
  client = redis.createClient(process.env.REDISCLOUD_URL, { no_ready_check: true });

};

exports.cacheIP = asyncHandler(async (req, res, next) => {

  const { pollID, ip } = req.body;

  // No poll and options sent with the request
  if (!pollID || !ip) {
    return next(new ErrorResponse('الرجاء ارسال جميع المتطلبات', 400));
  }


  const data = await client.get(ip, redis.print);

  if (!data) {
    const pollList = [pollID];
    client.setex(ip, 30, pollList, redis.print);
    return next();
  }

  if (!data.includes(pollID)) {
    data.push(pollID);
    client.setex(ip, 30, pollList, redis.print);
    return next();
  }

  return next(new ErrorResponse(429, 'فشل التحقق من  ip address'));

});