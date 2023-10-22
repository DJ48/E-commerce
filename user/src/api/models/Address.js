/**
 * This file will hold the schema for the Address Resource
 */
import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  /**
   *  address, zip, city, email, createdAt, updatedAt
   */

  userId: {
    type: Number,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
    minlength: 6,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => {
      return Date.now();
    },
  },
  updatedAt: {
    type: Date,
    immutable: true,
    default: () => {
      return Date.now();
    },
  },
});

const Address = mongoose.model("address", AddressSchema);

export default Address;
