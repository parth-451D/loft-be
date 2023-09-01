const express = require("express");
const router = express.Router();
const pool = require("../dbconfig");

// Get all users
router.get("/users", async (req, res) => {
  try {
    let sqlQuery = `SELECT * FROM users WHERE is_delete = 0 AND user_type = 'user';`;
    const [rows, fields] = await pool.query(sqlQuery);
    res.status(200).json(rows);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single user by ID
router.get("/user/:id", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM users WHERE id = ?",
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

// Create a new user
router.post("/user", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "INSERT INTO users (user_name,password,user_type,name) VALUES (?,?,'user',?)",
      [req.body.user_name, req.body.password, req.body.name]
    );
    const savedCategory = { id: rows.insertId, ...req.body };
    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a user
router.patch("/user/:id", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM users WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const updatedUser = { ...rows[0], ...req.body };

    await pool.query(
      "UPDATE users SET user_name = ?,password=?,name=? WHERE id = ?",
      [
        updatedUser.user_name,
        updatedUser.password,
        updatedUser.name,
        req.params.id,
      ]
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a user
router.delete("/user/:id", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM users WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    await pool.query("UPDATE users SET is_delete = 1 WHERE id = ?", [
      req.params.id,
    ]);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
