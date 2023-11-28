const express = require("express");
const router = express.Router();
const pool = require("../../dbconfig");
const cors = require("cors");
const fileUpload = require("../../libs/fileUpload");

// Get all contact us details
router.get("/contact-us", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM contact_us WHERE is_delete = 0"
    );

    res.status(200).json(rows);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single contact us detail by ID
router.get("/contact-us/:id", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM contact_us WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Contact us detail not found" });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Create a new contact us detail
router.post("/contact-us", async (req, res) => {
  try {
    if (req.body.id) {
      const [rows, fields] = await pool.query(
        "SELECT * FROM contact_us WHERE id = ?",
        [req.body.id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ message: "Contact us detail not found" });
      }
      const updatedContactUs = { ...rows[0], ...req.body };

      await pool.query(
        "UPDATE contact_us SET phone = ?, email = ?, address = ?, from_time = ?, to_time = ?, map = ? WHERE id = ?",
        [
          updatedContactUs.phone,
          updatedContactUs.email,
          updatedContactUs.address,
          updatedContactUs.from_time,
          updatedContactUs.to_time,
          updatedContactUs.map,
          updatedContactUs.id,
        ]
      );
      res.status(200).json(updatedContactUs);
    } else {
      const [rows, fields] = await pool.query(
        "INSERT INTO contact_us (phone, email, address, from_time, to_time, map) VALUES (?, ?, ?, ?, ?, ?)",
        [
          req.body.phone,
          req.body.email,
          req.body.address,
          req.body.from_time,
          req.body.to_time,
          req.body.map,
        ]
      );
      const savedContactUs = { id: rows.insertId, ...req.body };
      res.status(201).json(savedContactUs);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a contact us detail
router.patch("/contact-us/:id", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM contact_us WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Contact us detail not found" });
    }
    const updatedContactUs = { ...rows[0], ...req.body };

    await pool.query(
      "UPDATE contact_us SET phone = ?, email = ?, address = ?, from_time = ?, to_time = ?, map = ? WHERE id = ?",
      [
        updatedContactUs.phone,
        updatedContactUs.email,
        updatedContactUs.address,
        updatedContactUs.from_time,
        updatedContactUs.to_time,
        updatedContactUs.map,
        req.params.id,
      ]
    );
    res.status(200).json(updatedContactUs);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a contact us detail
router.delete("/contact-us/:id", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM contact_us WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Contact us detail not found" });
    }
    await pool.query("UPDATE contact_us SET is_delete = 1 WHERE id = ?", [
      req.params.id,
    ]);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
