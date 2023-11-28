const express = require("express");
const {
  payment,
  authOnly,
  capturePayment,
  releasePayment,
  depositRefund,
  getUserBookings,
  getBookingsByStatus,
} = require("./paymentController");
const { default: axios } = require("axios");
const { pool } = require("../../../dbconfig");
const router = express.Router();
const dotenv = require("dotenv");
const { emailSend } = require("../helper");
dotenv.config();

// auth only api
router.post("/authOnly-payment", authOnly);

// accept payment from admin side
router.post("/capture-payment", capturePayment);

// reject payment from admin side
router.post("/release-payment", releasePayment);

// refund deposit amount to user
router.post("/refund-deposit", depositRefund);

// get user booking by user id
router.get("/my-bookings/:userId", getUserBookings);

// get user booking by user id
router.get("/requested-bookings", getBookingsByStatus);

// email sending test
router.get("/emailsend", async(req,res) => {
  const emailOptions = {
    to: process.env.ADMIN_EMAIL,
    subject:
      "New Request for Booking",
    template: "newBooking",
    context: {
      "{link}": `${process.env.FRONT_URL}/admin/paymentRequest`,
    },
  };
  await emailSend(emailOptions);
res.send("mail send")
})

module.exports = router;
