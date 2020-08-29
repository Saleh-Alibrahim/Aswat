const mongoose = require('mongoose');

const QuestionsSchema = new mongoose.Schema({
  _id: {
    type: String,
    ref: 'PollItems._id',
    required: true
  },
  question: {
    type: String,
    ref: 'PollItems.questions.$._id',
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Question', QuestionsSchema);
