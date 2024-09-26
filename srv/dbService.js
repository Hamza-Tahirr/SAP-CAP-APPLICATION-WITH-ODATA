const axios = require('axios');
const odataBaseUrl = 'https://saprouter.tallymarkscloud.com:8450/sap/opu/odata/sap/ZCAP_ODATA_SRV/RecordsSet';

// Helper function to fetch the CSRF token
async function fetchCsrfToken() {
    try {
        const response = await axios.get(odataBaseUrl, {
            auth: {
                username: 'abapdev',
                password: 'Tmc@1234567',
            },
            headers: {
                'X-CSRF-Token': 'Fetch',  // Request the CSRF token
            },
        });

        return {
            csrfToken: response.headers['x-csrf-token'],  // CSRF token
            cookies: response.headers['set-cookie'],      // Cookies from the response
        };
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        throw new Error('Could not fetch CSRF token');
    }
}

// Function to fetch all records from OData (NO CSRF NEEDED)
async function getRecords(req, res) {
    try {
        const response = await axios.get(odataBaseUrl, {
            auth: {
                username: 'abapdev',
                password: 'Tmc@1234567',
            },
        });
        res.json(response.data.d.results);  // OData returns results inside 'd'
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).send({ error: error.message });
    }
}

// Function to fetch a single record by ID (NO CSRF NEEDED)
async function getRecordById(req, res) {
    const { Id } = req.params;  // Use 'Id' from the request parameters
    const recordUrl = `${odataBaseUrl}(Id='${Id}')`;

    try {
        const response = await axios.get(recordUrl, {
            auth: {
                username: 'abapdev',
                password: 'Tmc@1234567',
            },
        });
        res.json(response.data.d);
    } catch (error) {
        console.error('Error fetching record by ID:', error);
        res.status(500).send({ error: error.message });
    }
}

// Function to create a new record in OData (CSRF NEEDED)
async function insertRecord(req, res) {
    const { Id, Name, Location, Office } = req.body;
    const newRecord = { Id, Name, Location, Office };

    try {
        // Fetch CSRF token and cookies
        const { csrfToken, cookies } = await fetchCsrfToken();

        const response = await axios.post(odataBaseUrl, newRecord, {
            auth: {
                username: 'abapdev',
                password: 'Tmc@1234567',
            },
            headers: {
                'X-CSRF-Token': csrfToken,  // Include CSRF token in headers
                'Cookie': cookies.join(';'), // Include cookies from CSRF fetch response
                'Content-Type': 'application/json',
            },
        });
        res.status(201).json(response.data.d);
    } catch (error) {
        console.error('Error creating record:', error);
        res.status(500).send({ error: error.message });
    }
}

// Function to update an existing record by ID (CSRF NEEDED)
async function updateRecord(req, res) {
    const { Id } = req.params;  // Use 'Id' from the request parameters
    const { Name, Location, Office } = req.body;
    const recordUrl = `${odataBaseUrl}(Id='${Id}')`;

    try {
        // Fetch CSRF token and cookies
        const { csrfToken, cookies } = await fetchCsrfToken();

        // Update record with PUT
        await axios.put(recordUrl, { Name, Location, Office }, {
            auth: {
                username: 'abapdev',
                password: 'Tmc@1234567',
            },
            headers: {
                'X-CSRF-Token': csrfToken,  // Include CSRF token in headers
                'Cookie': cookies.join(';'), // Include cookies from CSRF fetch response
                'Content-Type': 'application/json',
            },
        });
        res.sendStatus(204);  // Success with no content
    } catch (error) {
        console.error('Error updating record:', error);
        res.status(500).send({ error: error.message });
    }
}

// Function to delete a record by ID (CSRF NEEDED)
async function deleteRecord(req, res) {
    const { Id } = req.params;  // Use 'Id' from the request parameters
    const recordUrl = `${odataBaseUrl}(Id='${Id}')`;

    try {
        // Fetch CSRF token and cookies
        const { csrfToken, cookies } = await fetchCsrfToken();

        // Delete record with DELETE
        await axios.delete(recordUrl, {
            auth: {
                username: 'abapdev',
                password: 'Tmc@1234567',
            },
            headers: {
                'X-CSRF-Token': csrfToken,  // Include CSRF token in headers
                'Cookie': cookies.join(';'), // Include cookies from CSRF fetch response
            },
        });
        res.sendStatus(204);  // Success with no content
    } catch (error) {
        console.error('Error deleting record:', error);
        res.status(500).send({ error: error.message });
    }
}

// Export the functions for use in other parts of the application
module.exports = {
    getRecords,
    getRecordById,
    insertRecord,
    updateRecord,
    deleteRecord,
};
