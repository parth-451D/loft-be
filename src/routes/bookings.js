const express = require('express');
const router = express.Router();
const pool = require('../../dbconfig');

// Get all bookings
router.get('/bookings', async (req, res) => {
  try {
    let sqlQuery = `SELECT b.id bookingId,b.room_id,DATE(b.start_date) start_date,b.end_date,b.start_time,b.end_time,b.is_confirmed,b.user_id,u.id,u.first_name,u.last_name,r.room_no,r.capacity,r.floor_no,r.price,r.status
    FROM bookings b 
    JOIN users u ON u.id = b.user_id
    JOIN rooms r ON r.id = b.room_id`;
    const [rows, fields] = await pool.query(sqlQuery);
    console.log("rows ---------- ",rows)
    res.status(200).json(rows);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single booking by ID
router.get('/bookings/:id', async (req, res) => {
  try {
    const [rows, fields] = await pool.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Create a new booking
router.post('/bookings', async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      'INSERT INTO bookings (room_id, start_date, end_date, user_id) VALUES (?, ?, ?, ?)',
      [req.body.room_id, req.body.start_date, req.body.end_date, req.body.user_id]
    );
    const savedBooking = { id: rows.insertId, ...req.body };
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a booking
router.patch('/bookings/:id', async (req, res) => {
  try {
    const [rows, fields] = await pool.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    const updatedBooking = { ...rows[0], ...req.body };
    await pool.query(
      'UPDATE bookings SET start_date = ?, end_date = ?, guest_name = ?, guest_email = ?, room_number = ? WHERE id = ?',
      [updatedBooking.start_date, updatedBooking.end_date, updatedBooking.guest_name, updatedBooking.guest_email, updatedBooking.room_number, req.params.id]
    );
    res.status(200).json(updatedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a booking
router.delete('/bookings/:id', async (req, res) => {
  try {
    const [rows, fields] = await pool.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    await pool.query('UPDATE bookings SET is_delete = 1 WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Freeze a booking
router.patch('/bookings/:id/freeze', async (req, res) => {
  try {
    const [rows, fields] = await pool.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' })
    }
    await pool.query(
        'UPDATE bookings SET status = ? WHERE id = ?',
        [req.body.status, req.params.id]
      );
      res.status(200).json(rows[0]);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

module.exports = router;
