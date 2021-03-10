const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGO_URI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log(`MongoDB Connected: ${connection.connection.host}`.blue);
  } catch (err) {
    console.error(err);
    //process.exita(1);
  }
};

module.exports = connectDB;
