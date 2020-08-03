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

// // Call getAverageCost after save
// PollSchema.pre('save', async function () {

//   const obj = await this.aggregate([
//     {
//       $match: { bootcamp: bootcampId }
//     },
//     {
//       $group: {
//         _id: '$bootcamp',
//         averageRating: { $avg: '$rating' }
//       }
//     }
//   ]);


// });

module.exports = mongoose.model('PollItems', PollSchema);
