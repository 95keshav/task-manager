const express = require("express");
const app = express();
const tasks = require("./routes/tasks");
const connectDB = require("./db/connection");
require("dotenv").config();

//middlewere
app.use(express.json());
app.use(express.static("./public"));

// I am using routes and controllers to manage code

//routes middlewere
app.use("/api/v1/tasks", tasks);

const port = 3000;

// handle db connection error
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(
      process.env.PORT || 3000,
      console.log(`app is listing at ${port}`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
