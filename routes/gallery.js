const express = require("express");
const router = express.Router();
const pool = require("../dbconfig");
const cors = require("cors");
const fileUpload = require("../libs/fileUpload");
// Get all gallery
router.get("/gallery", async (req, res) => {
  try {
    let sqlQuery = `SELECT g.id,g.image,gc.id category_id,gc.name category_name,g.file_name FROM gallery g 
    JOIN gallery_category gc ON gc.id = g.category_id WHERE g.is_delete = 0 ;`;
    console.log("sqlQuery ------- ",sqlQuery)
    const [rows, fields] = await pool.query(sqlQuery);

    Promise.all(
      rows.map(async (i) => {
        return new Promise(async (res, rej) => {
          let image = null;
          if (i.image) {
            image = await fileUpload.imageConvert(i.image);
          }
          res({ ...i, file: image });
        });
      })
    ).then((item) => {
      res.status(200).json(item);
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single booking by ID
router.get("/gallery/:id", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM gallery WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Create a new booking
router.post("/gallery", async (req, res) => {
  try {
    fileUpload
      .uploadImage(
        req.body.image,
        req.body.fileName.split(".").slice(0, -1).join(".")
      )
      .then(async (filePath) => {
        const [rows, fields] = await pool.query(
          "INSERT INTO gallery (category_id, image, file_name) VALUES (?, ?, ?)",
          [req.body.category_id, filePath, req.body.fileName]
        );
        const savedBooking = { id: rows.insertId, ...req.body };
        res.status(201).json(savedBooking);
      })
      .catch(async (err) => {
        const [rows, fields] = await pool.query(
          "INSERT INTO gallery (category_id) VALUES (?)",
          [req.body.category_id]
        );
        const savedBooking = { id: rows.insertId, ...req.body };
        res.status(201).json(savedBooking);
      });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a booking
router.patch("/gallery/:id", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM gallery WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Gallery not found" });
    }
    const updatedGallery = { ...rows[0], ...req.body };

    fileUpload
      .uploadImage(
        req.body.image,
        req.body.fileName.split(".").slice(0, -1).join(".")
      )
      .then(async (filePath) => {
        await pool.query(
          "UPDATE gallery SET category_id = ?, image = ?,file_name = ? WHERE id = ?",
          [
            updatedGallery.category_id,
            filePath,
            updatedGallery.fileName,
            req.params.id,
          ]
        );
        res.status(200).json(updatedGallery);
      })
      .catch(async (err) => {
        await pool.query("UPDATE gallery SET category_id = ? WHERE id = ?", [
          updatedGallery.category_id,
          req.params.id,
        ]);
        res.status(200).json(updatedGallery);
      });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a booking
router.delete("/gallery/:id", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM gallery WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    await pool.query("UPDATE gallery SET is_delete = 1 WHERE id = ?", [
      req.params.id,
    ]);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
