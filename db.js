// Подключение к базе данных PostgreSQL
const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  password: 'root',
  host: 'localhost',
  port: 5432,
  database: 'gps_data',
});

module.exports = pool;
