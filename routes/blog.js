const express = require("express");
const router = express.Router();
const pool = require("../dbconfig");
const cors = require("cors");
const fileUpload = require("../libs/fileUpload");

// Create a new blog
router.post("/blogs", async (req, res) => {
  console.log(req.body, "body");
  try {
    // fileUpload
    //   .uploadImage(
    //     req.body.image,
    //     req.body.fileName
    //   )
    // async (filePath) => {
      const bufferValue = Buffer.from(req.body.image, "base64");
      const [rows, fields] = await pool.query(
        "INSERT INTO blog (image,title, description) VALUES (?, ?, ? )",
        [bufferValue, req.body.title, req.body.description ]
      );
      const savedBooking = { id: rows.insertId, ...req.body ,message:"Save succesfully"};
      res.status(201).json(savedBooking );
    // };
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all property
router.get("/blogs", async (req, res) => {
  try {
    let sqlQuery = `SELECT * FROM blog where is_delete = 0`;
    console.log("sqlQuery ------- ", sqlQuery);
    const [rows, fields] = await pool.query(sqlQuery);

    res.status(200).json(rows);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single property by ID
router.get("/blogs/:id", async (req, res) => {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM blog WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a property
router.patch("/blogs/:id", async (req, res) => {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM blog WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }
    const updatedBlog = { ...rows[0], ...req.body };

    // fileUpload
    //   .uploadImage(
    //     req.body.image,
    //     req.body.fileName.split(".").slice(0, -1).join(".")
    //   )
      // (async (filePath) => {
        const buffer = Buffer.from(req.body.image, "base64");
        await pool.query(
          "UPDATE blog SET image = ?,title = ?, description = ? where id = ?",
          [buffer, updatedBlog.title, updatedBlog.description, req.params.id]
        );
        res.status(200).json(updatedBlog);
      // });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a property
router.delete("/blogs/:id", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM blog WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Property not found" });
    }
    await pool.query("UPDATE blog SET is_delete = 1 WHERE id = ?", [
      req.params.id,
    ]);
    res.status(200).send({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
