const knex = require('knex')({
  client: 'pg',
  connection: {
      host: process.env.HDB_HOST,
      user: process.env.HDB_USER,
      password: process.env.HDB_PASSWORD,
      database: process.env.HDB_DATABASE,
      port: 5432,
      ssl: {
        rejectUnauthorized: false
      }
  }
});

module.exports = knex;