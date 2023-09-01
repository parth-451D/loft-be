const express = require("express");
const router = express.Router();
const pool = require("../dbconfig");
const cors = require("cors");
const fileUpload = require("../libs/fileUpload");

// Add Floor
router.post("/floors", async (req, res) => {
  try {
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
    res
      .status(200)
      .json({
        message: "All floors has been fetched successfuly",
        floorsData: rows,
      });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
