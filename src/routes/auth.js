// Import necessary modules and setup the server
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const pool = require("../../dbconfig");

// User registration API
router.post("/register", async (req, res) => {
  try {
    // Insert a new user row into the database
    const [rows, fields] = await pool.execute(
      "INSERT INTO users (name, user_name, user_type,password) VALUES (?, ?, 'user' ,?)",
      [req.body.name, req.body.email, req.body.password]
    );
    const savedUser = {
      id: rows.insertId,
      name: req.body.name,
      email: req.body.email,
    };

    // Send a response back to the client
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// User login API
router.post("/login", async (req, res) => {
  try {
    // Check if the username exists in the database
    const [rows, fields] = await pool.execute(
      "SELECT * FROM users WHERE user_name = ? AND password = ?",
      [req.body.email, req.body.password]
    );
    const user = rows[0];
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate a JWT token and send it back to the client
    const token = jwt.sign({ id: user.id }, "TEST123"); //process.env.JWT_SECRET);
    res
      // .header("auth-token", token)
      .json({
        message: "Logged in successfully",
        token,
        user: { name: user.name, id: user.id, username: user.user_name },
      });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// User update password API
router.put("/update_password/:user_id", async (req, res) => {
  try {
    // Check if the user exists in the database
    const [rows, fields] = await pool.execute(
      "SELECT * FROM users WHERE id = ?",
      [req.params.user_id]
    );
    const user = rows[0];
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the old password matches the current password
    if (req.body.oldPassword !== user.password) {
      return res.status(400).json({ message: "Current password does not match" });
    }

    // Update the user's password
    await pool.execute("UPDATE users SET password = ? WHERE id = ?", [
      req.body.newPassword,
      req.params.user_id,
    ]);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
