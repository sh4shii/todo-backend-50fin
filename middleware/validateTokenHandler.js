const express = require("express");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const validateTokenHandler = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.Authorization || req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "User is not authorized" });
      } else {
        // console.log(decoded);
        req.user = decoded;
        next();
      }
    });
  }

  if (!token) {
    res
      .status(401)
      .json({ message: "User is not authorized or token is missing" });
  }
});

module.exports = validateTokenHandler;
