const mongoose = require('mongoose')

const PollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  poll_list: [{
    name: String
  },
  {
    count: Number,
    default: 0
  }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Items', PollSchema);
