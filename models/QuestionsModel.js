const mongoose = require('mongoose');
const shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const QuestionsSchema = new mongoose.Schema({
  _id: {
    type: String,
    ref: 'Polls._id',
    required: true
  },
  adminID: {
    type: String,
    ref: 'Polls.adminID',
    required: true,
    select: false
  },
  answers: [{
    _id: {
      type: String,
      default: shortid.generate
    },
    name: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    }
  }]
});

module.exports = mongoose.model('Questions', QuestionsSchema);
