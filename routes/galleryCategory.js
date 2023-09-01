const express = require("express");
const router = express.Router();
const pool = require("../dbconfig");
const cors = require("cors");
const fileUpload = require("../libs/fileUpload");

// Get all gallery
router.get("/gallery_category", async (req, res) => {
  try {
    let sqlQuery = `SELECT * FROM gallery_category WHERE is_delete = 0;`;
    const [rows, fields] = await pool.query(sqlQuery);
    res.status(200).json(rows);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single category by ID
router.get("/gallery_category/:id", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM gallery_category WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Create a new category
router.post("/gallery_category", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "INSERT INTO gallery_category (name) VALUES (?)",
      [req.body.name]
    );
    const savedCategory = { id: rows.insertId, ...req.body };
    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a category
router.patch("/gallery_category/:id", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM gallery_category WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Gallery category not found" });
    }
    const updatedGalleryCategory = { ...rows[0], ...req.body };

    await pool.query("UPDATE gallery_category SET name = ? WHERE id = ?", [
      updatedGalleryCategory.name,
      req.params.id,
    ]);
    res.status(200).json(updatedGalleryCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a category
router.delete("/gallery_category/:id", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM gallery_category WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    await pool.query("UPDATE gallery_category SET is_delete = 1 WHERE id = ?", [
      req.params.id,
    ]);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
