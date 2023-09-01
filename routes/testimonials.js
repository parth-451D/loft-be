const express = require("express");
const router = express.Router();
const pool = require("../dbconfig");
const cors = require("cors");
const fileUpload = require("../libs/fileUpload");

// Get all testimonials
router.get("/testimonials", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM testimonials WHERE is_delete = 0"
    );
    res.status(200).json(rows);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single testimonial by ID
router.get("/testimonials/:id", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM testimonials WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Create a new testimonial
router.post("/testimonials", async (req, res) => {
  try {
    fileUpload
      .uploadImage(
        req.body.image,
        req.body.fileName.split(".").slice(0, -1).join(".")
      )
      .then(async (filePath) => {
        const bufferValue = Buffer.from(req.body.image, "base64");
        const [rows, fields] = await pool.query(
          "INSERT INTO testimonials (image, name, city, description) VALUES (?, ?, ?, ?)",
          [bufferValue, req.body.name, req.body.city, req.body.description]
        );
        const savedTestimonial = { id: rows.insertId, ...req.body };
        res.status(201).json(savedTestimonial);
      });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a testimonial
router.patch("/testimonials/:id", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM testimonials WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    const updatedTestimonial = { ...rows[0], ...req.body };
    fileUpload
      .uploadImage(
        req.body.image,
        req.body.fileName.split(".").slice(0, -1).join(".")
      )
      .then(async (filePath) => {
        await pool.query(
          "UPDATE testimonials SET image = ?, name = ?, city = ?, description = ? WHERE id = ?",
          [
            req.body.image,
            updatedTestimonial.name,
            updatedTestimonial.city,
            updatedTestimonial.description,
            req.params.id,
          ]
        );
        res.status(200).json(updatedTestimonial);
      });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a testimonial
router.delete("/testimonials/:id", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM testimonials WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    await pool.query("UPDATE testimonials SET is_delete = 1 WHERE id = ?", [
      req.params.id,
    ]);
    res.status(200).send({ message: "Testimonial deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
