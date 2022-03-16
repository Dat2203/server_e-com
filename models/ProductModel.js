const mongoose = require("mongoose");
const Counter = require("../models/CounterIDModel");

const ProductSchema = new mongoose.Schema(
  {
    _id: String,
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    image01: { type: String },
    image02: { type: String },
    image03: { type: String },
    rating: { type: Number },
    size: [],
    colors: [],
    discount: { type: Number },
    regularPrice: { type: Number, required: true },
    slugName: { type: String },
    categorySlug: { type: String, required: true },
    gender: [],
  },
  { timestamps: true }
);

ProductSchema.pre("save", function (next) {
  var doc = this;
  Counter.findOneAndUpdate(
    { name: "product" },
    { $inc: { sequence_value: 1 } },
    { new: true },
    function (err, seq) {
      const idRule = "PCNF00000";
      if (err) return next(err);
      const id = seq.sequence_value.toString();
      const ID = idRule.slice(0, idRule.length - id.length) + id;
      doc._id = ID;
      next();
    }
  );
});
module.exports = mongoose.model("Product", ProductSchema);
