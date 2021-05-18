const Pool = require('pg').Pool

const pool = new Pool({
    host: '192.168.0.6',
    user: 'postgres',
    password: 'postgres',
    port: 5432,
    database: 'Carshop'
})

module.exports = pool;