/**
 * This file will hold the schema for the Product Resource
 */
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    /**
     *  name, description, brand, quantity, price, available, createdAt, updatedAt
     */

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
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

const Product = mongoose.model("product", ProductSchema);

export default Product;
