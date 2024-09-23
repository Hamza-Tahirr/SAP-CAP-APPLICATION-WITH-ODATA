// srv/server.js
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { initializeDB, getRecords, getRecordById, insertRecord, updateRecord, deleteRecord } = require('./dbService');

const app = express();
app.use(express.json()); // To parse JSON request bodies

// Initialize SQLite database
initializeDB(path.join(__dirname, '../db/records.db'));

// Serve static files from the "app" directory
app.use(express.static(path.join(__dirname, '../app')));

// API Routes for CRUD operations on "records"
app.get('/api/records', getRecords);
app.get('/api/records/:id', getRecordById);
app.post('/api/records', insertRecord);
app.put('/api/records/:id', updateRecord);
app.delete('/api/records/:id', deleteRecord);

// Serve the AngularJS app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../app/index.html'));
});

// Start the Express server
const port = process.env.PORT || 4004;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
