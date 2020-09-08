const mongoose = require('mongoose');

const QuestionsSchema = new mongoose.Schema({
  _id: {
    type: String,
    ref: 'PollItems._id',
    required: true
  },
  answers: [String]
});

module.exports = mongoose.model('Questions', QuestionsSchema);
