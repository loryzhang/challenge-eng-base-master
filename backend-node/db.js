const mysql = require('mysql');
module.exports = mysql.createPool({
  host: 'db',
  user: 'root',
  password: 'testpass',
  database: 'challenge',
});