
require('dotenv').config();

const mysql = require('mysql');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT 
});






db.connect(err => {
  if (err) {
    console.error(`❌ Database connection failed: ${err.message}`);
    process.exit(1); // Exit process if unable to connect
  }
  console.log('✅ Database connected successfully');
});

// Export the database connection
module.exports = db;
