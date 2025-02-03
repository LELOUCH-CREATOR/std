const express = require('express');
const router = express.Router();
const db = require('../db'); // Ensure this points to your database connection module

// Get all attendance records with student names
router.get('/', (req, res) => {
    const query = `
        SELECT a.id, a.student_id, s.name AS student_name, a.date, a.status 
        FROM attendance a
        JOIN students s ON a.student_id = s.student_id
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching attendance records:', err);
            return res.status(500).json({ error: 'Failed to fetch attendance records' });
        }
        res.json(results);
    });
});

// Add a new attendance record
router.post('/', (req, res) => {
    const { student_id, date, status } = req.body;

    // Validate input
    if (!student_id || !date || !status) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the student exists
    db.query('SELECT * FROM students WHERE student_id = ?', [student_id], (err, results) => {
        if (err) {
            console.error('Error validating student:', err);
            return res.status(500).json({ error: 'Failed to validate student' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Insert the attendance record
        const insertQuery = 'INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)';
        db.query(insertQuery, [student_id, date, status], (err, results) => {
            if (err) {
                console.error('Error adding attendance record:', err);
                return res.status(500).json({ error: 'Failed to add attendance record' });
            }
            res.status(201).json({ message: 'Attendance record added', id: results.insertId });
        });
    });
});

// Delete an attendance record
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    // Validate input
    if (!id) {
        return res.status(400).json({ error: 'Attendance ID is required' });
    }

    // Delete the attendance record
    const deleteQuery = 'DELETE FROM attendance WHERE id = ?';
    db.query(deleteQuery, [id], (err, results) => {
        if (err) {
            console.error('Error deleting attendance record:', err);
            return res.status(500).json({ error: 'Failed to delete attendance record' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Attendance record not found' });
        }

        res.json({ message: 'Attendance record deleted' });
    });
});

module.exports = router;