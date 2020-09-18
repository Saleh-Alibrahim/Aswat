const mongoose = require('mongoose');

const QuestionsSchema = new mongoose.Schema({
  _id: {
    type: String,
    ref: 'Polls._id',
    required: true
  },
  adminID: {
    type: String,
    ref: 'Polls.adminID',
    required: true
  },
  answers: [String]
});

module.exports = mongoose.model('Questions', QuestionsSchema);
