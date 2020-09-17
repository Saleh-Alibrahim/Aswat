const mongoose = require('mongoose');
const shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const PollSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
    required: true
  },
  adminID: {
    type: String,
    required: true
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
    default: false
  },
  hidden: {
    type: Boolean,
    default: false
  },
  question: {
    type: String,
  },
  vpn: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


// Get the total vote number 
PollSchema.methods.getTotalVotes = async function () {
  let totalVote = 0;
  this.options.forEach(option => {
    totalVote += option.voteCount;
  });
  this.total = totalVote;
};

// Add percentage to each option
PollSchema.methods.addPercentageToOptions = async function () {
  this.options.forEach(option => {
    option.percentage = (option.voteCount / this.total) * 100;
    if (!isFinite(option.percentage)) {
      option.percentage = 0;
    } else if (!Number.isInteger(option.percentage)) {
      option.percentage = option.percentage.toFixed(2);
    }
  });
};

// Create Address collections when poll created 
PollSchema.post('save', async function () {
  if (this.hidden || this.ipAddress) { await this.model('Address').create({ _id: this._id }); }
  if (this.question) { await this.model('Questions').create({ _id: this._id }); }
});

// Cascade delete IpAddress when a poll is deleted
PollSchema.pre('remove', async function (next) {
  if (this.hidden || this.ipAddress) { await this.model('Address').deleteMany({ _id: this._id }); }
  if (this.question) { await this.model('Questions').deleteMany({ _id: this._id }); }
  next();
});


// Reverse populate Address with virtuals
PollSchema.virtual('addresses', {
  ref: 'Address',
  localField: '_id',
  foreignField: '_id',
  justOne: false
});

// Reverse populate Questions with virtuals
PollSchema.virtual('questions', {
  ref: 'Questions',
  localField: '_id',
  foreignField: '_id',
  justOne: false
});



module.exports = mongoose.model('Polls', PollSchema);
