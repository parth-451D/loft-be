const express = require("express");
const router = express.Router();
const {
  checkForMinimunStay,
  checkForAvailableFloor,
  checkForAvailableFlats,
} = require("./flatController");

router.get("/available-flats", checkForMinimunStay);

// get available floors by criteria
router.post(
  "/check-available-floors",
  checkForMinimunStay,
  checkForAvailableFloor
);

// get available flats 
router.post("/check-available-flats", checkForMinimunStay, checkForAvailableFlats)
module.exports = router;
