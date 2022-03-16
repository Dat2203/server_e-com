const express = require("express");
const app = express();
const port = 4000;
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoute = require("./router/authRoute");
const userRoute = require("./router/userRoute");
const productRoute = require("./router/productRoute");
const addressRoute = require("./router/addressRoute");
const orderRoute = require("./router/orderRoute");

// Connect to DB

mongoose
  .connect(
    "mongodb+srv://dat2203:anh220301@e-com.bmgmh.mongodb.net/E-commercal?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connect to MongoDB successfully!!!");
  })
  .catch((err) => console.log("Fail to connect to MongoDB"));

// Apply Cors configuration
app.use(cors());
dotenv.config();

//urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Router
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/product", productRoute);
app.use("/address", addressRoute);
app.use("/order", orderRoute);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
