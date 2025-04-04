const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  bnm: { type: String, required: true }, // Building Name
  st: { type: String, required: true }, // Street
  loc: { type: String, required: true }, // Locality
  bno: { type: String, required: true }, // Building Number
  stcd: { type: String, required: true }, // State Code
  pncd: { type: String, required: true }, // Pincode
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    gstNumber: { type: String, required: true, unique: true }, // GST Number
    tradeName: { type: String, required: true }, // Trade Name
    legalName: { type: String, required: true }, // Legal Name
    address: { type: AddressSchema, required: true }, // Address Schema
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }, // GST Status
    password: { type: String, required: true }, // Hashed Password
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
