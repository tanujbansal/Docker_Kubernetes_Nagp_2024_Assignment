const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});


const createTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS employee (
      id SERIAL PRIMARY KEY,
      name VARCHAR(30),
      email VARCHAR(60),
      designation VARCHAR(30),
      department VARCHAR(30)
    );
  `;
  
  try {
    await pool.query(createTableQuery);
    console.log('Employee table created or already exists');
  } catch (error) {
    console.error('Error creating employee table:', error);
  }
};

app.post('/addEmployee', async (request, response) => {
  const { name, email, designation, department } = request.body;
  try {
    const result = await pool.query(
      'INSERT INTO employee (name, email, designation, department) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, designation, department]
    );
    response.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    response.status(500).send('Internal Server Error');
  }
});

app.get('/getAllEmployees', async (request, response) => {
  try {
    const result = await pool.query('SELECT * FROM employee ORDER BY id DESC');
    response.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    response.status(500).send('Internal Server Error');
  }
});

app.delete('/deleteAllEmployees', async (request, response) => {
  try {
    const result = await pool.query('DELETE FROM employee');
    response.status(200).json("");
  } catch (error) {
    console.error(error);
    response.status(500).send('Internal Server Error');
  }
});

app.listen(port, async () => {
  await createTable();
  console.log(`Server is running on port ${port}`);
});
