const express = require("express");
const router = express.Router();
const pool = require("../dbconfig");
const cors = require("cors");
const fileUpload = require("../libs/fileUpload");

// Add Minimum Stay
router.post("/minimum-stay", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "INSERT INTO minimum_stay (start_date, end_date, selected_days, category_1, category_2, category_3,category_4, category_5) VALUES (?,?,?,?,?,?,?,?)",
      [
        req.body.start_date,
        req.body.end_date,
        req.body.selected_days,
        req.body.category_1,
        req.body.category_2,
        req.body.category_3,
        req.body.category_4,
        req.body.category_5,
      ]
    );
    const saveStay = { id: rows.insertId, ...req.body };
    res
      .status(201)
      .json({ message: "Stay Addede Successfully", data: saveStay });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all stays
router.get("/minimum-stay", async (req, res) => {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM minimum_stay where is_deleted = 0");
    res.status(200).json({
      message: "All minimum stays has been fetched successfuly",
      staysData: rows,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// get specific stay
router.get("/minimum-stay/:id", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM minimum_stay WHERE id =?",
      [req.params.id]
    );
    if (rows.length > 0) {
      res
        .status(200)
        .json({ stayData: rows[0], message: "Minimum stay fetch successfully" });
    } else {
      res.status(400).json({ message: "Stay does not exist with this ID" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// delete stay
router.delete("/minimum-stay/:id", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM minimum_stay WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Stay not found" });
    }
    await pool.query("UPDATE minimum_stay SET is_deleted = 1 WHERE id = ?", [
      req.params.id,
    ]);
    res.status(200).send({ message: "Stay deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// update stay
router.put("/minimum-stay/:id", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM minimum_stay WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Stay not found" });
    }
    const updatedStay = { ...rows[0], ...req.body };
    await pool.query(
      "UPDATE minimum_stay SET start_date = ?,end_date = ?, selected_days = ?, category_1 = ?, category_2 = ?, category_3 = ?,category_4 = ?,category_5 = ? where id = ?",
      [
        updatedStay.start_date,
        updatedStay.end_date,
        updatedStay.selected_days,
        updatedStay.category_1,
        updatedStay.category_2,
        updatedStay.category_3,
        updatedStay.category_4,
        updatedStay.category_5,
        req.params.id,
      ]
    );
    res
      .status(200)
      .json({ message: "Updated Stay Successfully", stayData: updatedStay });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
