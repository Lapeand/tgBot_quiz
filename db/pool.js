const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function pingDatabase() {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    console.log('Успешное подключение к базе данных!:', res.rows[0]);
    client.release();
  } catch (error) {
    console.error('Ошибка в подключенни базе данных:', error);
  }
}

module.exports = {pool, pingDatabase};