const mongoose = require('mongoose');
const shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');


const PollSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  title: {
    type: String,
    required: true
  },
  poll_list: [{
    _id: {
      type: String,
      default: shortid.generate
    },
    name: {
      type: String,
      required: true
    },
    numberVote: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    }
  }],
  total: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});


// Update the total vote in the database
PollSchema.methods.updateTotalVotes = async function () {

  const poll_list = this.poll_list;
  let totalVote = 0;
  for (let i = 0; i < poll_list.length; i++) {
    totalVote = totalVote + poll_list[i].numberVote;
  }

  this.total = totalVote;
  await this.save();
};

// Update the percentage in each option 
PollSchema.methods.updatePercentage = async function () {

  const totalVote = this.total;

  const poll_list = this.poll_list;

  for (let i = 0; i < poll_list.length; i++) {
    this.poll_list[i].percentage = Math.floor(poll_list[i].numberVote / totalVote * 100);
  }

  await this.save();
};

module.exports = mongoose.model('PollItems', PollSchema);
