const mongoose = require('mongoose');
const shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
const autoIncrement = require('mongoose-auto-increment');


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
    voteCount: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    }
  }],
  questions: [{
    _id: {
      type: String,
    },
    title: {
      type: String,
    }

  }],
  total: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


// Update the total vote in the database
PollSchema.methods.updateTotalVotes = async function () {
  let totalVote = 0;
  this.options.forEach(option => {
    totalVote += option.voteCount;
  });
  this.total = totalVote;
  await this.save();
};

// Update the percentage of each option 
PollSchema.methods.updatePercentage = async function () {

  const totalVote = this.total;

  this.options.forEach(option => {
    option.percentage = (option.voteCount / totalVote * 100).toFixed(2);
  });


  await this.save();
};

// Make the questions id auto increment
PollSchema.plugin(autoIncrement.plugin, { model: 'PollItems', field: 'questions.$._id' });

module.exports = mongoose.model('PollItems', PollSchema);
