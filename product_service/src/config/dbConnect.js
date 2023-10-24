import mongoose from "mongoose";

const dbConnect = () => {
  mongoose.connect(process.env.DB_URL);

  mongoose.connection.on("connected", () => {
    console.log("Connected to Product Service database successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.log("Error while connecting to Product Service database:" + err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Product Service Database Disconnected!!!");
  });
};

export default dbConnect;
