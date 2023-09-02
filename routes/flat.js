const express = require("express");
const router = express.Router();
const pool = require("../dbconfig");
const cors = require("cors");
const fileUpload = require("../libs/fileUpload");

// Create a new flat
router.post("/flat", async (req, res) => {
  try {
    const [duplicate, colum] = await pool.query(
      "SELECT * From flats where unitNo = ?",
      [req.body.unitNo]
    );
    if (duplicate.length > 0) {
      res.status(400).json({ message: "Flat already exists" });
    } else {
      try {
        let flatImages = req.body.images.map((ele) =>
          Buffer.from(ele, "base64")
        );
        const images = JSON.stringify(flatImages);
        console.log(typeof flatImages);
        const [rows, fields] = await pool.query(
          "INSERT INTO flats (floorId, unitNo, unitType, cleaningFees, startDate, endDate, description, images, price, bathrooms, beds, guests) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            req.body.floorId,
            req.body.unitNo,
            req.body.unitType,
            req.body.cleaningFees,
            req.body.startDate,
            req.body.endDate,
            req.body.description,
            images,
            req.body.price,
            req.body.bathrooms,
            req.body.beds,
            req.body.guests,
          ]
        );
        res.status(201).json({ message: "Flat Added successfully" });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single flat by ID
router.get("/flat/:id", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT flats.*, unit_types.* FROM flats LEFT JOIN unit_types ON flats.unitType = unit_types.id WHERE flats.id = ? AND flats.is_delete = 0;",
      [req.params.id]
    );
    if (rows.length > 0) {
      res
        .status(200)
        .json({ flatData: rows, message: "Flat fetch successfully" });
    } else {
      res.status(400).json({ message: "Flat does not exist with this ID" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all flat
router.get("/flat", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT flats.*, unit_types.* FROM flats LEFT JOIN unit_types ON flats.unitType = unit_types.id WHERE flats.is_delete = 0;"
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Flats not found" });
    }
    res.status(200).json(rows);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a flat
router.patch("/flat/:id", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM flats WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Flat not found" });
    }
    const updatedProperty = { ...rows[0], ...req.body };
    let flatImages = req.body.images.map((ele) => Buffer.from(ele, "base64"));
    const images = JSON.stringify(flatImages);
    await pool.query(
      "UPDATE flats SET floorId = ?,unitNo = ?,  unitType = ?,cleaningFees = ?, startDate = ?,   endDate = ?, description = ?, images = ?, price = ?,  bathrooms = ?, beds = ?, guests = ?     WHERE id = ?;",
      [
        (req.body.floorId,
        req.body.unitNo,
        req.body.unitType,
        req.body.cleaningFees,
        req.body.startDate,
        req.body.endDate,
        req.body.description,
        images,
        req.body.price,
        req.body.bathrooms,
        req.body.beds,
        req.body.guests,
        req.params.id),
      ]
    );
    res.status(200).json({
      message: "Flat updated successfully",
      flatData: updatedProperty,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// delete flat
router.delete("/flat/:id", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM flats WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Flat not found" });
    }
    await pool.query("UPDATE flats SET is_delete = 1 WHERE id = ?", [
      req.params.id,
    ]);
    res.status(200).send({ message: "Flat deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
