/* eslint-disable */
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const { DB, DB_HOST, DB_USER, DB_PASSWORD } = require('./constants');

const db = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB,
  multipleStatements: true,
});

const query = (queries, params) => new Promise((resolve, reject) => {
  db.query(queries, params, (err, result) => {
    if (err) {
      return reject(err);
    }
    return resolve(result);
  });
});

fs.readFile(path.join(__dirname, '/MOCK_DATA.csv'), 'utf8', (err, data) => {
  const mockData = data.split('\n').map((row) => {
    const cols = row.split(',');
    const msg = {};
    msg.user = cols[0];
    msg.ts = Math.floor(Date.parse(cols[cols.length - 1]) / 1000);
    msg.text = cols.slice(1, cols.length - 1).join('').replace('"', '');
    return msg;
  });
  mockData.sort((a, b) => b.ts - a.ts);
  const asyncAddUsers = async () => {
    const uniqUsers = new Set();
    mockData.forEach(rows => uniqUsers.add(rows.user));
    const uniqRows = Array.from(uniqUsers);

    while (uniqRows.length) {
      const user = uniqRows.pop();
      if (!user.length) {
        continue;
      }
      const email = `${user}@fake.com`;
      const row_ts = Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 1000);
      const login_ts = row_ts - Math.floor(Math.random() * 1000);
      const logout_ts = login_ts - Math.floor(Math.random() * 10000);
      try {
        await query('insert into users (user, email, login_ts, logout_ts) values (?, ?, ?, ?)', [user, email, login_ts, logout_ts]);
      } catch (e) {
        console.error(e);
      }
      console.log(user, 'done!');
    }
  };

  const asyncAddMessages = async () => {
    while (mockData.length) {
      const row = mockData.pop();
      if (isNaN(row.ts)) {
        continue;
      }
      try {
        await query('insert into messages (user, ts, text) values (?, ?, ?)', [row.user, row.ts, row.text]);
      } catch (e) {
        console.err(e);
      }
      console.log(row, 'done!');
    }
  };
  asyncAddUsers();
  asyncAddMessages();
});