// add mongose database connection module
const mongoose = require("mongoose");

// adding this connection on server js to handle if db not connected server should stop
const connectDB = (url) => {
  return mongoose.connect(url, {
    //use these params to remove deprication warnings
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
};

module.exports = connectDB;
