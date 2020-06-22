const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://Saleh:23933123@cluster0-om8vw.mongodb.net/StrawPoll?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.blue);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
