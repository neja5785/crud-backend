// server.js

const express = require('express');
const db = require('./db');  // Import the PostgreSQL connection from db.js
const app = express();
const cors = require('cors');

// Middleware to parse JSON request bodies and handle CORS
app.use(express.json());
app.use(cors());

// -----------------------------------
// CRUD Routes for Students
// -----------------------------------

// 1. Create a new student (POST)
app.post('/students', async (req, res) => {
    const { first_name, last_name, birth_date, course, is_erasmus } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO students (first_name, last_name, birth_date, course, is_erasmus)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [first_name, last_name, birth_date, course, is_erasmus]
        );
        res.status(201).json(result.rows[0]);  // Return the newly created student
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create student' });
    }
});

// 2. Get all students (GET)
app.get('/students', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM students');
        res.json(result.rows);  // Return all students
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve students' });
    }
});

// 3. Get a single student by ID (GET)
app.get('/students/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM students WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(result.rows[0]);  // Return the student with the given ID
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve student' });
    }
});

// 4. Update a student by ID (PUT)
app.put('/students/:id', async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, birth_date, course, is_erasmus } = req.body;
    try {
        const result = await db.query(
            `UPDATE students
             SET first_name = $1, last_name = $2, birth_date = $3, course = $4, is_erasmus = $5
             WHERE id = $6
             RETURNING *`,
            [first_name, last_name, birth_date, course, is_erasmus, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(result.rows[0]);  // Return the updated student
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update student' });
    }
});

// 5. Delete a student by ID (DELETE)
app.delete('/students/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM students WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete student' });
    }
});

// -----------------------------------
// Start the server
// -----------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
