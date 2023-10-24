import express from "express";
import { verifyToken } from "../api/middlewares/IsAuthorized.js";

import {
  addProduct,
  deleteProduct,
  fetchProductById,
  fetchProductList,
  updateProduct,
} from "../api/controllers/ProductManagementController.js";

const router = express.Router();

/* ======================== Product Management Controller ===================================================== */
//Add Product
router.post("/product/add", verifyToken, addProduct);
//Update Product
router.put("/product/update", verifyToken, updateProduct);
//Fetch Product List
router.get("/product/list", verifyToken, fetchProductList);
//Delete Product
router.delete("/product/delete", verifyToken, deleteProduct);
//Fetch Product By id
router.get("/product/details", verifyToken, fetchProductById);

export default router;
