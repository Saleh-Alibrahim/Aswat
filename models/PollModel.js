const mongoose = require('mongoose')

const PollSchema = new mongoose.Schema({
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
