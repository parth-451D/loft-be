const express = require("express");
const router = express.Router();
const cors = require("cors");
const { register, changePassword, login, dataFromToken } = require("./authController");

router.post("/register", register);
router.post("/login", login);
router.post("/change-password", dataFromToken, changePassword);
// router.post("/forget-password", AuthController.register);

module.exports = router;
