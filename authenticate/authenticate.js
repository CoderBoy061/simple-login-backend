const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");
const fs = require("fs");
const authenticate = async (req, res, next) => {
  try {
    const SECRET_KEY = fs.readFileSync("private.key");
    const token = req.cookies.jwtoken;
    const verifyToken = jwt.verify(token, SECRET_KEY);

    const rootUser = await User.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });

    if (!rootUser) {
      throw new Error("User not found");
    }
    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next();
  } catch (err) {
    res.status(401).send("Unauthorized");
  }
};
module.exports = authenticate;
