const express = require('express');
const app = express();
const mysql = require('mysql2');
require('dotenv').config(); 

// Create a connection to the database
const db = mysql.createConnection({
  user: process.env.DB_USER,  
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Test the connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ', err.stack);
        return;
    }
    console.log('Connected to the database as ID: ' + db.threadId);
});

// Question 1 - Retrieve all patients details
app.get('/patients', (req, res) => {
    const getPatients = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    
    db.query(getPatients, (err, results) => {
        if (err) {
            return res.status(500).send('Sorry, patients not found!!!');
        }
        res.status(200).json(results);  
    });
});

// Question 2 - Retrieve all providers details
app.get('/providers', (req, res) => {
    const getProviders = 'SELECT first_name, last_name, provider_specialty FROM providers';
    
    db.query(getProviders, (err, results) => {
        if (err) {
            return res.status(500).send('Sorry, providers not found!!!');
        }
        res.status(200).json(results);  
    });
});

// Question 3 - Filter patients by First Name
app.get('/patients/first-name/:firstName', (req, res) => {
    const { firstName } = req.params;  //replacing the parameter on the local host with a 1st name gets you the output.eg http://localhost:3000/patients/first-name/Far
    
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?'; 
    db.query(query, [firstName], (err, results) => {
        if (err) {
            return res.status(500).send('Sorry, patients first_name not found!!!');
        }
        res.status(200).json(results);  
    });
});

// Question 4 - Retrieve all providers by their specialty
app.get('/providers/specialty/:specialty', (req, res) => {
    const { specialty } = req.params;  //replacing the parameter on the local host with a 1st name gets you the output.eg http://localhost:3000/providers/specialty/Pediatrics
    
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?'; 
    
    db.query(query, [specialty], (err, results) => {
        if (err) {
            return res.status(500).send('Sorry, providers by specialty not found!!!');
        }
        res.status(200).json(results);  
    });
});

// listen to the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});