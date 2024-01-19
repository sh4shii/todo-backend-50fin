const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const getAllUsers = asyncHandler(async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const signUpUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are mandatory" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log("Hashed password: ", hashedPassword);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // console.log(`User created ${user}`);
    res.status(201).json({ _id: user.id, email: user.email });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are mandatory" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Cannot find user by this email" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Incorrect Password" });
    }

    const payload = {
      name: user.name,
      email: user.email,
      _id: user._id,
    };

    // console.log(payload);

    const accessToken = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    res.status(200).json(accessToken);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const currentUser = asyncHandler(async (req, res, next) => {
  // console.log("Current user information");
  res.json(req.user);
});

module.exports = { getAllUsers, signUpUser, loginUser, currentUser };
