import express from "express";
import {
  signup,
  login,
  logout,
  generateToken,
  verifyTokenRequest,
} from "../api/controllers/UserSessionManagementController.js";
import {
  verifyToken,
  verifyRefreshToken,
} from "../api/middlewares/IsAuthorized.js";

import {
  addAddress,
  deleteAddress,
  fetchAddressList,
  updateAddress,
} from "../api/controllers/AddressManagementController.js";

const router = express.Router();

/* ======================== Account Session Controller ===================================================== */
//User Signup
router.post("/signup", signup);
//User Signin
router.post("/signin", login);
//User Logout
router.delete("/logout", verifyToken, logout);
//Generate new token
router.post("/refresh", verifyRefreshToken, generateToken);
//Verify token
router.post("/verify", verifyTokenRequest);

/* ======================== Address Management Controller ===================================================== */
//Add Address
router.post("/address/add", verifyToken, addAddress);
//Update Address
router.put("/address/update", verifyToken, updateAddress);
//Fetch Address List
router.get("/address/list", verifyToken, fetchAddressList);
//Delete Address
router.delete("/address/delete", verifyToken, deleteAddress);

export default router;
