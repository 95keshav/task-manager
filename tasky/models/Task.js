const mongoose = require("mongoose");

// this will setup the schema in mongodb cloud
const TasksSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Must Provide Name of Task"],
    trim: true,
    maxlength: [100, "Name connot be mopre that 100 characters"],
  },
  completed: { type: Boolean, default: false },
  weight: {
    type: Number,
    default: 1,
  },
});

// this will compile create, copy task schema and its
module.exports = mongoose.model("Task", TasksSchema);
