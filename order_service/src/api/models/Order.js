/**
 * This file will hold the schema for the Order Resource
 */
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    /**
     *  orderId, userId, items, totalPrice, status, createdAt, updatedAt
     */

    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Number,
      required: true,
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
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    transactionId: { type: String, required: true, unique: true },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

const Order = mongoose.model("order", OrderSchema);

export default Order;
