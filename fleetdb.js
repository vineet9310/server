const { Pool } = require('pg');

const fleet = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'fleet_management',
  password: '1123',
  port: 5432,
});

fleet.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
    return;
  }
  console.log('Connected to PostgreSQL fleet Management DB ');

  // Release the client back to the pool
  release();
});

module.exports = fleet;
