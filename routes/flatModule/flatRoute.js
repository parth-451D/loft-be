const express = require("express");
const router = express.Router();
const { checkForMinimunStay } = require("./flatController");

router.get("/available-flats", checkForMinimunStay)

module.exports = router;
