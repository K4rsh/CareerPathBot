// src/utils/db.ts
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost', // MySQL host
  user: 'root', // MySQL username
  password: 'Liontail@16', // MySQL password
  database: 'career_navigator', // Database name
});

export default pool;
