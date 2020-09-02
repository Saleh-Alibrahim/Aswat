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
    voteCount: {
      type: Number,
      default: 0
    }
  }],
  ipAddress: {
    type: Boolean,
    required: false,
    default: false
  },
  vpn: {
    type: Boolean,
    required: false,
    default: true
  },
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


// Cascade delete questions when a poll is deleted
PollSchema.pre('remove', async function (next) {
  await this.model('Questions').deleteMany({ _id: this._id });
  next();
});



module.exports = mongoose.model('Polls', PollSchema);
