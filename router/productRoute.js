const Product = require("../models/ProductModel");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const regularPrice = parseInt(req.body.regularPrice);
  const discount = parseInt(req.body.discount);
  const data = { ...req.body, regularPrice, discount };
  console.log(data);
  const newProduct = new Product(data);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json("lôi");
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET PRODUCT
router.get("/find/:slug", async (req, res) => {
  try {
    console.log(req.params.slug);
    const product = await Product.findOne({ slugName: req.params.slug });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET NEW Product
router.get("/find-new", async (req, res) => {
  try {
    const newProduct = await Product.find().sort({ _id: -1 }).limit(16);
    res.status(200).json(newProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;

//GET Product gender
router.get("/category/:gender", async (req, res) => {
  const gender = req.params.gender;
  console.log(gender);
  try {
    const product = await Product.find({ gender: gender });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const product = await Product.find();
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});
