const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");
const dotenv = require("dotenv");
dotenv.config();
const secret = process.env.SECRET;
const authenticate = require("../authenticate/authenticate");

//sending post request to signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const oldUser = await User.findOne({ email: email });
    if (oldUser)
      return res.status(400).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, secret, {
      expiresIn: "1h",
    });

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
});

//sending post request to login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await User.findOne({ email: email });

    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "1h",
    });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

//sending get request to home where user get validate using authenticate middleware using jwt token
router.get("/home",authenticate,(req,res)=>{
   res.status(200).send({message:"Successfull validation"})
})

module.exports = router;
