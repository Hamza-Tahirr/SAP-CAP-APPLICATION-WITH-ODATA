const axios = require('axios');

const odataBaseUrl = process.env.SAP_ODATA_URL;
const auth = {
    username: process.env.SAP_USER,
    password: process.env.SAP_PASSWORD,
};

if (!odataBaseUrl || !auth.username || !auth.password) {
    console.warn('SAP_ODATA_URL, SAP_USER or SAP_PASSWORD is not set. Copy .env.example to .env and fill it in.');
}

// OData string keys are quoted, so a single quote inside the key has to be doubled
function recordUrl(id) {
    const key = encodeURIComponent(String(id).replace(/'/g, "''"));
    return `${odataBaseUrl}(Id='${key}')`;
}

function sendError(res, message, error) {
    console.error(`${message}:`, error.message);
    const status = (error.response && error.response.status) || 500;
    res.status(status).send({ error: error.message });
}

// Helper function to fetch the CSRF token
async function fetchCsrfToken() {
    try {
        const response = await axios.get(odataBaseUrl, {
            auth,
            headers: {
                'X-CSRF-Token': 'Fetch',
            },
        });

        const cookies = (response.headers['set-cookie'] || []).map((cookie) => cookie.split(';')[0]);

        return {
            csrfToken: response.headers['x-csrf-token'],
            cookie: cookies.join('; '),
        };
    } catch (error) {
        console.error('Error fetching CSRF token:', error.message);
        throw new Error('Could not fetch CSRF token');
    }
}

// Function to fetch all records from OData (NO CSRF NEEDED)
async function getRecords(req, res) {
    try {
        const response = await axios.get(odataBaseUrl, { auth });
        res.json(response.data.d.results);  // OData returns results inside 'd'
    } catch (error) {
        sendError(res, 'Error fetching records', error);
    }
}

// Function to fetch a single record by ID (NO CSRF NEEDED)
async function getRecordById(req, res) {
    try {
        const response = await axios.get(recordUrl(req.params.Id), { auth });
        res.json(response.data.d);
    } catch (error) {
        sendError(res, 'Error fetching record by ID', error);
    }
}

// Function to create a new record in OData (CSRF NEEDED)
async function insertRecord(req, res) {
    const { Id, Name, Location, Office } = req.body;
    const newRecord = { Id, Name, Location, Office };

    try {
        const { csrfToken, cookie } = await fetchCsrfToken();

        const response = await axios.post(odataBaseUrl, newRecord, {
            auth,
            headers: {
                'X-CSRF-Token': csrfToken,
                'Cookie': cookie,
                'Content-Type': 'application/json',
            },
        });
        res.status(201).json(response.data.d);
    } catch (error) {
        sendError(res, 'Error creating record', error);
    }
}

// Function to update an existing record by ID (CSRF NEEDED)
async function updateRecord(req, res) {
    const { Name, Location, Office } = req.body;

    try {
        const { csrfToken, cookie } = await fetchCsrfToken();

        await axios.put(recordUrl(req.params.Id), { Name, Location, Office }, {
            auth,
            headers: {
                'X-CSRF-Token': csrfToken,
                'Cookie': cookie,
                'Content-Type': 'application/json',
            },
        });
        res.sendStatus(204);
    } catch (error) {
        sendError(res, 'Error updating record', error);
    }
}

// Function to delete a record by ID (CSRF NEEDED)
async function deleteRecord(req, res) {
    try {
        const { csrfToken, cookie } = await fetchCsrfToken();

        await axios.delete(recordUrl(req.params.Id), {
            auth,
            headers: {
                'X-CSRF-Token': csrfToken,
                'Cookie': cookie,
            },
        });
        res.sendStatus(204);
    } catch (error) {
        sendError(res, 'Error deleting record', error);
    }
}

module.exports = {
    getRecords,
    getRecordById,
    insertRecord,
    updateRecord,
    deleteRecord,
};
