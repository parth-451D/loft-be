const express = require("express");
const router = express.Router();
const { checkForMinimunStay, checkForAvailableFloor } = require("./flatController");

router.get("/available-flats", checkForMinimunStay);

router.post("/check-available-floors", checkForAvailableFloor);

module.exports = router;
