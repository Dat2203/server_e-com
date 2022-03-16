const Address = require("../models/AddressModel");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const router = require("express").Router();

//Creat Address
router.post("/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  const isDefautAdress = req.body.isDefautAdress;
  try {
    const adresses = await Address.find({ userId: id });
    isDefautAdress = adresses.length > 0 ? true : isDefautAdress;

    const newAddress = new Address({ ...req.body, isDefautAdress, userId: id });
  } catch (err) {}
  console.log(isDefautAdress);
  // try {
  //   if (isDefautAdress === true) {
  //     const currentDefaultAddress = Address.findOne(
  //       { userId: id, isDefautAdress: true },
  //       { $set: { isDefautAdress: false } }
  //     );
  //   }
  //   const savedAddress = await newAddress.save();
  //   res.status(200).json(savedAddress);
  // } catch (err) {
  //   res.status(500).json(err);
  // }
});

//GET all addresses

router.get("/:id", async (req, res) => {
  try {
    const adresses = await Address.find({ userId: req.params.id });
    res.status(200).json(adresses);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get default addresses
router.get("/default/:id", async (req, res) => {
  try {
    const adresses = await Address.findOne({
      userId: req.params.id,
      isDefautAdress: true,
    });
    res.status(200).json(adresses);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
