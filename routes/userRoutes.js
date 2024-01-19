const express = require("express");
const { getAllUsers, signUpUser, loginUser, currentUser } = require("../controllers/userController");
const validateTokenHandler = require("../middleware/validateTokenHandler");

const router = express.Router();

router.get("/", getAllUsers);
router.get("/current", validateTokenHandler, currentUser);
router.post("/signup", signUpUser)
router.post("/login", loginUser)

module.exports = router;