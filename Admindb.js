const { Pool } = require('pg')

const pool = new Pool({
  user: 'drone',
  host: "dpg-ck7bpho8elhc7399buug-a.singapore-postgres.render.com",
  database: 'admin_db_mdff',
  password: 'HZauv0eC6gtm1f1gcwr0Eu13BhB5nmpw',
  port: 5432,
  ssl: true
})


pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error(err)
    return
  }
  console.log('Admin connected at:', res.rows[0].now)
})

module.exports = pool
