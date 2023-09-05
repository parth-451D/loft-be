const express = require("express");
const router = express.Router();
const pool = require("../dbconfig");
const cors = require("cors");
const fileUpload = require("../libs/fileUpload");

// Create a new maintenance
router.post("/maintenance", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "INSERT INTO maintenance (start_date, end_date, flatId) VALUES (?, ?, ?)",
      [req.body.start_date, req.body.start_date, req.body.flatId]
    );
    const savedMaintenance = { id: rows.insertId, ...req.body };
    res
      .status(201)
      .json({
        message: "Maintenance added successfully",
        data: savedMaintenance,
      });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// // Get all property
// router.get("/property", async (req, res) => {
//   try {
//     let sqlQuery = `SELECT * FROM property where is_delete = 0`;
//     const [rows, fields] = await pool.query(sqlQuery);

//     res.status(200).json(rows);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Get a single property by ID
// router.get("/property/:id", async (req, res) => {
//   try {
//     const [rows, fields] = await pool.query(
//       "SELECT * FROM property WHERE id = ?",
//       [req.params.id]
//     );
//     if (rows.length === 0) {
//       return res.status(404).json({ message: "Property not found" });
//     }
//     res.status(200).json(rows[0]);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Update a property
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

// // Delete a property
// router.delete("/property/:id", async (req, res) => {
//   try {
//     const [rows, fields] = await pool.query(
//       "SELECT * FROM property WHERE id = ?",
//       [req.params.id]
//     );
//     if (rows.length === 0) {
//       return res.status(404).json({ message: "Property not found" });
//     }
//     await pool.query("UPDATE property SET is_delete = 1 WHERE id = ?", [
//       req.params.id,
//     ]);
//     res.status(200).send({ message: "Property deleted successfully" });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

module.exports = router;
