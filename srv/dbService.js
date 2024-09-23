// Import the SQLite3 library and enable verbose mode for detailed error logging
const sqlite3 = require('sqlite3').verbose();

let db; // Variable to store the database connection

// Function to initialize the SQLite database
function initializeDB(dbPath) {
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            // Log an error if the connection to the database fails
            console.error('Failed to connect to database:', err.message);
        } else {
            // Log success message if the database connection is established
            console.log('Connected to SQLite database.');
            // Create the "records" table if it doesn't already exist
            db.run(`
                CREATE TABLE IF NOT EXISTS records (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    location TEXT,
                    office TEXT
                )
            `);
        }
    });
}

// Function to fetch all records from the database
function getRecords(req, res) {
    // SQL query to select all records
    db.all('SELECT * FROM records', [], (err, rows) => {
        if (err) {
            // Send an error response if the query fails
            res.status(500).send({ error: err.message });
        } else {
            // Send the retrieved records as a JSON response
            res.json(rows);
        }
    });
}

// Function to fetch a specific record by ID
function getRecordById(req, res) {
    const { id } = req.params; // Get the ID from the request parameters
    // SQL query to select a record by ID
    db.get('SELECT * FROM records WHERE id = ?', [id], (err, row) => {
        if (err) {
            // Send an error response if the query fails
            res.status(500).send({ error: err.message });
        } else if (!row) {
            // Send a 404 response if the record is not found
            res.status(404).send({ error: 'Record not found' });
        } else {
            // Send the found record as a JSON response
            res.json(row);
        }
    });
}

// Function to insert a new record into the database
function insertRecord(req, res) {
    const { name, location, office } = req.body; // Get the record details from the request body
    // SQL query to insert a new record
    db.run('INSERT INTO records (name, location, office) VALUES (?, ?, ?)', [name, location, office], function(err) {
        if (err) {
            // Send an error response if the insertion fails
            res.status(500).send({ error: err.message });
        } else {
            // Send a 201 status with the new record ID if insertion is successful
            res.status(201).send({ id: this.lastID });
        }
    });
}

// Function to update an existing record in the database
function updateRecord(req, res) {
    const { id } = req.params; // Get the record ID from the request parameters
    const { name, location, office } = req.body; // Get the updated record details from the request body
    // SQL query to update the record with the provided ID
    db.run('UPDATE records SET name = ?, location = ?, office = ? WHERE id = ?', [name, location, office, id], function(err) {
        if (err) {
            // Send an error response if the update fails
            res.status(500).send({ error: err.message });
        } else {
            // Send a 204 No Content response to indicate successful update
            res.sendStatus(204);
        }
    });
}

// Function to delete a record from the database
function deleteRecord(req, res) {
    const { id } = req.params; // Get the record ID from the request parameters
    // SQL query to delete the record with the provided ID
    db.run('DELETE FROM records WHERE id = ?', [id], function(err) {
        if (err) {
            // Send an error response if the deletion fails
            res.status(500).send({ error: err.message });
        } else {
            // Send a 204 No Content response to indicate successful deletion
            res.sendStatus(204);
        }
    });
}

// Export the functions for use in other parts of the application
module.exports = {
    initializeDB,
    getRecords,
    getRecordById,
    insertRecord,
    updateRecord,
    deleteRecord
};
