const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  name: { type: String },
  sequence_value: { type: Number, default: 1 },
});

module.exports = mongoose.model("Counter", CounterSchema);
