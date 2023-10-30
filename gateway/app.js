import express from "express";
import cors from "cors";
import proxy from "express-http-proxy";

import { config } from "dotenv";

config();

const PORT = process.env.PORT || 9000;
const app = express();

app.use(cors());

app.use("/user", proxy(process.env.AUTH_SERVICE_URL));
app.use("/product", proxy(process.env.PRODUCT_SERVICE_URL));
app.use("/order", proxy(process.env.ORDER_SERVICE_URL));
app.get("/", (req, res) => {
  res.send("Gateway Server is Responding !!!");
});

app.listen(PORT, () => {
  console.log(`Gateway is Listening to Port ${PORT}`);
});
