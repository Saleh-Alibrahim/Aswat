const mongoose = require('mongoose');
const shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');


const PollSchema = new mongoose.Schema({
  _id: {
    'type': String,
    'default': shortid.generate
  },
  title: {
    type: String,
    required: true,
  },
  poll_list: [{
    name: String,
    numberVote: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PollItems', PollSchema);
