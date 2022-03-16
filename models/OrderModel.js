const mongoose = require("mongoose");
const Counter = require("../models/CounterIDModel");

const OrderSchema = new mongoose.Schema(
  {
    _id: String,
    userId: { type: String },
    products: [
      {
        productName: {
          type: String,
        },
        productSlug: {
          type: String,
        },
        quantity: {
          type: Number,
        },
        price: { type: Number },
      },
    ],
    quantity: { type: Number },
    name: { type: String },
    paymentMethod: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    amount: { type: Number, required: true },
    address: { type: String, required: true },
    status: { type: String, default: "pending" },
  },

  { _id: false, timestamps: true }
);

OrderSchema.pre("save", function (next) {
  var doc = this;
  Counter.findOneAndUpdate(
    { name: "order" },
    { $inc: { sequence_value: 1 } },
    { new: true },
    function (err, seq) {
      const idRule = "CNF0000";
      if (err) return next(err);
      const id = seq.sequence_value.toString();
      const ID = idRule.slice(0, idRule.length - id.length) + id;
      doc._id = ID;
      next();
    }
  );
});

module.exports = mongoose.model("Order", OrderSchema);
