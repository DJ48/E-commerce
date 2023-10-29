/**
 * This file will hold the schema for the Cart Resource
 */
import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    /**
     *  name, description, brand, quantity, price, available, createdAt, updatedAt
     */

    userId: {
      type: Number,
      required: true,
      unique: true,
    },
    items: [
      {
        productId: {
          type: String,
          required: true,
          unique: true,
        },
        name: {
          type: String,
          required: true,
          unique: true,
        },
        description: {
          type: String,
          required: true,
        },
        brand: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        available: {
          type: Boolean,
          required: true,
        },
      },
    ],
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

const Cart = mongoose.model("cart", CartSchema);

export default Cart;
