const express = require('express');
const path = require('path');
const { getRecords, getRecordById, insertRecord, updateRecord, deleteRecord } = require('./dbService');

const app = express();
app.use(express.json()); // Parse JSON request bodies

// Serve static files from the "app" directory
app.use(express.static(path.join(__dirname, '../app')));

// API Routes for CRUD operations using OData
app.get('/api/records', getRecords);
app.get('/api/records/:Id', getRecordById); // Using 'Id' instead of 'id'
app.post('/api/records', insertRecord);
app.put('/api/records/:Id', updateRecord); // Using 'Id'
app.delete('/api/records/:Id', deleteRecord); // Using 'Id'

// Serve the AngularJS app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../app/index.html'));
});

// Start the Express server
const port = process.env.PORT || 4004;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
