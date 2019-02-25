//require packages
const db = require("pg");
const keys = require('./keys')

// create PostgreSQL connection
const connection = new db.Client({
  host: "localhost",
  port: 5432,
  user: "eventonica",
  password: keys.dbPassword,
  database: "eventonica"
});

module.exports = connection;