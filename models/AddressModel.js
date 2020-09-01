const mongoose = require('mongoose');
const ms = require('ms');
const AddressSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
    required: true
  },
  pollID: {
    type: String,
    ref: 'Polls._id',
    required: true
  },
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: '1m' },
  },

});


module.exports = mongoose.model('Address', AddressSchema);
