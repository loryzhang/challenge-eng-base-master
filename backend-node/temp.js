/* eslint-disable */
const fs = require('fs');
const path = require('path');

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
  
  let result = [];
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
      result.push(`insert into users (user, email, login_ts, logout_ts) values ('${user}', '${email}', ${login_ts}, ${logout_ts})`);
    }
  console.log(result.join(';'));
  return result;
});