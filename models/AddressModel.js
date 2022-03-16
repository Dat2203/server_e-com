const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    recivedName: { type: String, required: true },
    recivedNumber: { type: String, required: true },
    recivedAddress: { type: String, required: true },
    isDefautAdress: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", AddressSchema);
