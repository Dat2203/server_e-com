const User = require("../models/UserModels");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const Product = require("../models/ProductModel");
const router = require("express").Router();
const bcrypt = require("bcrypt");

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  console.log(req.body);
  const user = await User.findById(req.params.id);
  // const validPassword = await bcrypt.compare(
  //   req.body.comfirmPassword,
  //   user.password
  // );
  // !validPassword && res.status(400).json("wrong password");

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER
router.get("/get/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

// handle wishlist
router.post("/wishlist/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user.Wishlist.includes(req.body.slugName)) {
      await user.updateOne({ $push: { Wishlist: req.body.slugName } });
      res.status(200).json("Bạn đã thêm sản phẩm vào mục yêu thích");
    } else {
      await user.updateOne({ $pull: { Wishlist: req.body.slugName } });
      res.status(200).json("Bạn đã xóa sản phẩm vào mục yêu thích!!!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// get wishlist

router.get("/wishlist/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const wishlist = await Product.find({
      slugName: { $in: user.Wishlist },
    });
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL USER
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = await User.find({ isAdmin: false });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
