const express = require('express');
const router = express.Router();
const pool = require('../dbconfig');

// Get all amenities
router.get('/amenities', async (req, res) => {
  try {
    let sqlQuery = `SELECT amt.id id,amt.title title,amt.description description
    FROM amenities amt WHERE amt.is_delete = 0`;
    const [rows, fields] = await pool.query(sqlQuery);
    res.status(200).json(rows);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single amenities by ID
router.get('/amenities/:id', async (req, res) => {
  try {
    const [rows, fields] = await pool.query('SELECT * FROM amenities WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Amenities not found' });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Create a new amenities
router.post('/amenities', async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      'INSERT INTO amenities (title, description) VALUES (?, ?)',
      [req.body.title, req.body.description]
    );
    const savedAmenities = { id: rows.insertId, ...req.body };
    res.status(201).json(savedAmenities);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a amenities
router.patch('/amenities/:id', async (req, res) => {
  try {
    const [rows, fields] = await pool.query('SELECT * FROM amenities WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Amenities not found' });
    }
    const updatedAmenities = { ...rows[0], ...req.body };
    await pool.query(
      'UPDATE amenities SET title = ?, description = ? WHERE id = ?',
      [updatedAmenities.title, updatedAmenities.description, req.params.id]
    );
    res.status(200).json(updatedAmenities);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a amenities
router.delete('/amenities/:id', async (req, res) => {
  try {
    const [rows, fields] = await pool.query('SELECT * FROM amenities WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Amenities not found' });
    }
    await pool.query('UPDATE amenities SET is_delete = 1 WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


module.exports = router;
