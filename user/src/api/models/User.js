/**
 * This file will hold the schema for the User Resource
 */
import mongoose from "mongoose";
/**
 *  name, userId, password, email, createdAt, updatedAt, address, cart
 *  order
 */

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    minlength: 10,
    unique: true,
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
  cart: [
    {
      product: {
        _id: { type: String, require: true },
        name: { type: String },
        brand: { type: String },
        price: { type: Number },
      },
      quantity: { type: Number, require: true },
    },
  ],
  orders: [
    {
      _id: { type: String, required: true },
      amount: { type: String },
      date: { type: Date, default: Date.now() },
    },
  ],
});

const User = mongoose.model("user", UserSchema);

export default User;
