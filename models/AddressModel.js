const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  _id: {
    type: String,
    ref: 'Polls._id',
    required: true
  },
  ipAddress: [String]

});

// Static method Add address to the database
AddressSchema.statics.addAddress = async function (ip, pollID) {
  try {
    const address = await this.model('Address').findById(pollID);

    // Check if the  ip address of the user already in the list if not add him
    if (!address.ipAddress.includes(ip)) {
      address.ipAddress.push(ip);
      await address.save();
      return true;
    }
    else {
      return false;
    }
  }
  catch (err) {
    console.log(err);
  }
};

// Static method Add address to the database
AddressSchema.statics.getAddress = async function (ip, pollID) {
  try {

    const address = await this.model('Address').findById(pollID);
    // Check if the ip address of the user already in the list 
    if (!address.ipAddress.includes(ip)) {
      return true;
    }
    else {
      return false;
    }
  }
  catch (err) {
    console.log(err);
  }
};

module.exports = mongoose.model('Address', AddressSchema);
