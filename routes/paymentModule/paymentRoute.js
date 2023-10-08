const express = require("express");
const { payment, authOnly, capturePayment } = require("./paymentController");
const router = express.Router();

// auth only api
router.post("/authOnly-payment", authOnly)

// accept payment admin side
router.post("/capture-payment", capturePayment)

module.exports = router;
