import express from "express";
import { verifyToken } from "../api/middlewares/IsAuthorized.js";

import {
  addToCart,
  deleteCartItem,
  fetchCartDetails,
  updateCart,
} from "../api/controllers/CartManagementController.js";
import {
  orderDetails,
  orderPlace,
} from "../api/controllers/OrderManagementController.js";

const router = express.Router();

/* ======================== Cart Management Controller ===================================================== */
//Add to Cart
router.post("/cart/add", verifyToken, addToCart);
//Update Cart
router.put("/cart/update", verifyToken, updateCart);
//Delete Cart
router.delete("/cart/delete", verifyToken, deleteCartItem);
//Fetch Cart Details
router.get("/cart/details", verifyToken, fetchCartDetails);

/* ======================== Order Management Controller ===================================================== */
// Place an Order
router.post("/order/place", verifyToken, orderPlace);
// Order Details
router.get("/order/details", verifyToken, orderDetails);
export default router;
