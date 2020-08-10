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
  options: [{
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
  let totalVote = 0;
  this.poll_list.forEach(option => {
    totalVote += option.numberVote;
  });
  this.total = totalVote;
  await this.save();
};

// Update the percentage of each option 
PollSchema.methods.updatePercentage = async function () {

  const totalVote = this.total;

  this.poll_list.forEach(option => {
    option.percentage = (option.numberVote / totalVote * 100).toFixed(2);
  });


  await this.save();
};

module.exports = mongoose.model('PollItems', PollSchema);
