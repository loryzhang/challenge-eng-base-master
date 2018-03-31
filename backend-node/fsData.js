const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const db = mysql.createConnection({
  host: process.env.db || 'db',
  user: 'root',
  password: process.env.dbpassword === '' ? '' : 'testpass',
  database: 'challenge',
  debug: true,
  multipleStatements: true,
});

db.connect();
fs.readFile(path.join(__dirname, '/MOCK_DATA.csv'), 'utf8', (err, data) => {
  const mockData = data.split('\n').map((row) => {
    const cols = row.split(',');
    const msg = {};
    msg.user = cols[0];
    msg.ts = Math.floor(Date.parse(cols[cols.length - 1]) / 1000);
    msg.text = cols.slice(1, cols.length - 1).join('').replace('\"', '');
    return msg;
  });
  mockData.sort((a, b) => {
    return b.ts - a.ts;
  });
  const asyncAddUsers = async() => {
    const uniqUsers = new Set();
    mockData.forEach(rows => uniqUsers.add(rows.user));
    const uniqRows = Array.from(uniqUsers);
    
    while (uniqRows.length) {
      const user = uniqRows.pop();
      const row_ts = Math.floor(Date.now()/1000) - Math.floor(Math.random() * 1000);
      const login_ts = row_ts - Math.floor(Math.random() * 1000);
      const logout_ts = login_ts - Math.floor(Math.random() * 10000)
      const eachAddUser = await query('insert into users (user, login_ts, logout_ts) values (?, ?, ?)', [user, login_ts, logout_ts]);
      console.log(user, 'done!');
    } 
  }

  const asyncAddMessages = async() => {
    while (mockData.length) {
      const row = mockData.pop();
      if (isNaN(row.ts)) {
        continue;
      }
      const ts = row.ts - Math.floor(Math.random() * 1000);
      const eachAddMessage = await query('insert into messages (user, ts, text) values (?, ?, ?)', [row.user, row.ts, row.text]);
      console.log(row, 'done!');
    } 
  }
  asyncAddUsers();
  asyncAddMessages();
});

const query = (query, params) => {
  return new Promise((resolve, reject) => {
        db.query(query, params, (err, result) => {
          if (err) {
            return reject(err);
          } else {
            return resolve(result);
          }
        }); 
  });
};