const Order = require("../models/OrderModel");
const Counter = require("../models/CounterIDModel");
// const getNextSequenceValue = require("../util/getID");

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const dotenv = require("dotenv");
dotenv.config();

const KEY = process.env.STRIPE_PRIVATE_KEY;
const stripe = require("stripe")(KEY);
const router = require("express").Router();

//CREATE

router.post("/create", async (req, res) => {
  // const idString = "CNF0000";
  // try {

  //   console.log(idRule.slice(0, idRule.length - id.length) + id);
  // } catch (err) {
  //   console.log(err);
  // }
  // // console.log(id);
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: parseInt(req.body.amount),
      currency: "VND",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
        console.log(stripeErr);
      } else {
        console.log("OK");
        res.status(200).json(stripeRes);
      }
    }
  );
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER ORDERS
router.get("/find/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
