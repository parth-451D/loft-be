const express = require("express");
const router = express.Router();
const pool = require("../dbconfig");
const cors = require("cors");
const fileUpload = require("../libs/fileUpload");

// Create a new flat
router.post("/flat", async (req, res) => {
  try {
    const [duplicate, colum] = await pool.query(
      "SELECT * From flats where floorId = ? and flatNo = ?",
      [req.body.floorId, req.body.flatNo]
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
          "INSERT INTO flats (floorId, flatNo, type, cleaningFees, startDate, endDate, description, images, price, bathrooms) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            req.body.floorId,
            req.body.flatNo,
            req.body.type,
            req.body.cleaningFees,
            req.body.startDate,
            req.body.endDate,
            req.body.description,
            images,
            req.body.price,
            req.body.bathrooms,
          ]
        );
        res
          .status(201)
          .json({ message: "Flat Added successfully", id: rows.insertId });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single floor flat by ID
router.get("/flat/:id", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM flats WHERE floorId =? and is_delete = 0",
      [req.params.id]
    );
    if (rows.length > 0) {
      res
        .status(200)
        .json({ floorData: rows, message: "Flat fetch successfully" });
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
      "SELECT * FROM flats WHERE is_delete = 0"
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json(rows);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a property
// router.patch("/property/:id", async (req, res) => {
//   try {
//     const [rows, fields] = await pool.query(
//       "SELECT * FROM property WHERE id = ?",
//       [req.params.id]
//     );
//     if (rows.length === 0) {
//       return res.status(404).json({ message: "Property not found" });
//     }
//     const updatedProperty = { ...rows[0], ...req.body };
//     const buffer = Buffer.from(req.body.image, "base64");
//     await pool.query(
//       "UPDATE property SET image = ?,title = ?, price = ?, description = ?, square_foot = ?, room_capacity = ?, num_washroom = ? where id = ?",
//       [
//         buffer,
//         updatedProperty.title,
//         updatedProperty.price,
//         updatedProperty.description,
//         updatedProperty.square_foot,
//         updatedProperty.room_capacity,
//         updatedProperty.num_washroom,
//         req.params.id,
//       ]
//     );
//     res.status(200).json(updatedProperty);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// Delete a flat

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
