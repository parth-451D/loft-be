const express = require("express");
const router = express.Router();
const pool = require("../dbconfig");

router.post("/complaints", async (req, res) => {
  try {
    const { name, mobile_number, unit_number, subject, message } = req.body;

    const result = await pool.execute(
      "INSERT INTO complaints (name, mobile_number, unit_number, subject, message) VALUES (?, ?, ?, ?, ?)",
      [name, mobile_number, unit_number, subject, message]
    );

    res.json({
      id: result.insertId,
      message: "Complaint created successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/complaints", async (req, res) => {
  try {
    const [rows, fields] = await pool.execute(
      "SELECT * FROM complaints WHERE is_delete = 0 AND is_active = 1"
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/complaints/:id", async (req, res) => {
  try {
    const [rows, fields] = await pool.execute(
      "SELECT * FROM complaints WHERE id = ? AND is_delete = 0 AND is_active = 1",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.put("/complaints/:id", async (req, res) => {
  try {
    const { name, mobile_number, unit_number, subject, message } = req.body;

    const [rows, fields] = await pool.execute(
      "UPDATE complaints SET name = ?, mobile_number = ?, unit_number = ?, subject = ?, message = ? WHERE id = ? AND is_delete = 0 AND is_active = 1",
      [name, mobile_number, unit_number, subject, message, req.params.id]
    );

    if (rows.affectedRows === 0) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ message: "Complaint updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.delete("/complaints/:id", async (req, res) => {
  try {
    const [rows, fields] = await pool.execute(
      "UPDATE complaints SET is_delete = 1 WHERE id = ?",
      [req.params.id]
    );

    if (rows.affectedRows === 0) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ message: "Complaint Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
