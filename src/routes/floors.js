const express = require("express");
const router = express.Router();
const pool = require("../../dbconfig");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const fileUpload = require("../../libs/fileUpload");
const { addFloor } = require("./paymentModule/paymentController");
const { default: axios } = require("axios");

// Add Floor
router.post("/floors", async (req, res) => {
  try {
    // const payload = {
    //   xCardNum: "4444333322221111",
    //   xExp: "1234",
    //   xCvv: "111",
    //   xAmount: "1200",
    //   xKey: process.env.CARDKNOX_API_KEY,
    //   xCommand: "cc:AuthOnly",
    //   xVersion: "5.0.0",
    //   xSoftwareName: "Loft",
    //   xSoftwareVersion: "1.0.0",
    // };

    // const cardKnoxResponse = await axios.post(
    //   process.env.CARDKNOX_API_URL,
    //   payload
    // );
    // console.log(cardKnoxResponse.data);
    const [dulicateRow, duplicateColumn] = await pool.query(
      "SELECT * from floors where floorname = ?",
      [req.body.floorName]
    );
    if (dulicateRow.length > 0) {
      res.status(400).json({ message: "Floor already exists" });
    } else {
      const [rows, fields] = await pool.query(
        "INSERT INTO floors (floorName) VALUES (?)",
        [req.body.floorName]
      );
      const savedFloor = { id: rows.insertId, ...req.body };
      res.status(201).json(savedFloor);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get floors
router.get("/floors", async (req, res) => {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM floors");
    res.status(200).json({
      message: "All floors has been fetched successfuly",
      floorsData: rows,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
