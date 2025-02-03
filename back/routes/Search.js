const express = require('express');
const router = express.Router();
const db = require('./db'); // Your database connection

// GET /api/search - Search for students
router.get('/search', async (req, res) => {
    const searchQuery = req.query.query;

    if (!searchQuery) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    try {
        // Query to search for students by name and include attendance and fee status
        const query = `
            SELECT 
                s.student_id,
                s.name,
                a.status AS attendance,
                f.status AS fee_status
            FROM students s
            LEFT JOIN attendance a ON s.student_id = a.student_id
            LEFT JOIN fees f ON s.student_id = f.student_id
            WHERE s.name LIKE ?
            GROUP BY s.student_id, s.name, a.status, f.status;
        `;
        const values = [`%${searchQuery}%`]; // Case-insensitive search
        const result = await db.query(query, values);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error searching students:', error);
        res.status(500).json({ error: 'Failed to search students' });
    }
});

module.exports = router;