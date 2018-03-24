const mysql = require('mysql');
module.exports = mysql.createPool({
  host: process.env.db || 'db',
  user: 'root',
  password: process.env.dbpassword === '' ? '' : 'testpass',
  database: 'challenge',
});