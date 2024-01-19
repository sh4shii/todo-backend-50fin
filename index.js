const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection");
const userRoutes = require("./routes/userRoutes");
const todoRoutes = require("./routes/todoRoutes");
const cors = require('cors');

const port = process.env.PORT || 4000;

connectDb();
const app = express();

// Middleware to parse JSON in the request body
app.use(express.json());
app.use(cors());

app.use("/api/user", userRoutes);
app.use("/api/todo", todoRoutes);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
