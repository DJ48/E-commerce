import express from "express";
import { config } from "dotenv";
import dbConnect from "./src/config/dbConnect.js";
import router from "./src/config/routes.js";
import bodyParser from "body-parser";

config();
dbConnect();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/v1", router);

//Start The server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Server Started on the port: " + port);
});
