const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //verify if user exist
    const existingMail = await User.findOne({ email: req.body.email });
    if (existingMail) {
      res.status(403).json("Mail already registered");
    } else {
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        res.status(403).json("Username already in Use");
      } else {
        //create new user
        const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
        });

        //save user and respond
        const savedUser = await newUser.save();
        const { password, updatedAt, ...other } = savedUser._doc;
        res.status(200).json(other);
      }
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).json("This mail is not registered in our Database");
    } else {
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        res.status(400).json("The password is Incorrect");
      } else {
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
