const mysql = require('mysql');
const db = mysql.createPool({
  host: process.env.db || 'db',
  user: 'root',
  password: process.env.dbpassword === '' ? '' : 'testpass',
  database: 'challenge',
});

module.exports = {
  checkUser: (user, callback) => {
    db.getConnection((err, connection) => {
      if (err) {
        callback(err);
        return;
      }
      const query =  'SELECT UNIX_TIMESTAMP (pre_ts) as pre_ts FROM users where user = ?';
      connection.query(query, [ user ], (err, result) => {
        if (err) {
          callback(err);
          connection.release();
          return;
        }
        console.log('inCheck', result[0]);
        callback(null, result);
        connection.release();
      });
    });
  },
  addUser: (user, callback) => {
    db.getConnection((err, connection) => {
      if (err) {
        callback(err);
        return;
      }
      const addUser = 'insert into users (user) value (?)';
      connection.query(addUser, [ user ], (err) => {
        if (err) {
          callback(err);
          connection.release();
          return;
        }
        connection.release();
      });
    });
  },
  checkMissedCountInDB: (pre_ts, callback) => {
    db.getConnection((err, connection) => {
      if (err) {
        callback(err);
        return;
      }
      const missedCount = 'select count(*) as missedCount from messages where UNIX_TIMESTAMP (ts) > ?';
      connection.query(missedCount, [pre_ts], (err, result) => {
        if(err) {
          callback(err);
          connection.release();
          return;
        }
        callback(null, result);
        connection.release();
      });
    });
  },
  insertMessageToDb: (message, callback) => {
    const { user, text, ts } = message;
    db.getConnection((err, connection) => {
      const query = 'insert into messages (user, text, ts) values (?, ?, ?)';
      const params = [user, text, ts];
      connection.query(query, params, (err) => {
        if(err) {
          callback(err);
        } else {
         callback(null);
        }
        connection.release();
      });
    });
  },
  saveLogOutToDb: (user, pre_ts, callback) => {
    db.getConnection((err, connection) => {
      const query = 'update users set pre_ts = ? where user = ?';
      const params = [ pre_ts, user ];
      connection.query(query, params, (err) => {
        if(err) {
          callback(err);
        } else {
         callback(null);
        }
        connection.release();
      });
    });
  },
  // saveLoginToDb: (user, room, callback) => {
  //   db.getConnection((err, connection) => {
  //     const query = 'insert into ? (user) value (?)';
  //     const params = [ room, user ];
  //     connection.query(query, params, (err) => {
  //        if(err) {
  //          callback(err);
  //        } else {
  //         callback(null);
  //        }
  //        connection.release();
  //     });
  //   });
  // },

  fetchUsersCache: (callback) => {
    db.getConnection((err, connection) => {
      connection.query('select user from users order by ts desc limit 50', (err, users) => {
        if(err) {
          callback(err);
          return;
        }
        connection.release();
        callback(null, users);
      });
    });
  },
  fetchMessagesCache: (callback)=> {
    db.getConnection((err, connection) => {
      connection.query('select user, text, UNIX_TIMESTAMP (ts) as ts from messages order by ts asc limit 50', (err, messages) => {
        if(err) {
          callback(err);
        }
        connection.release();
        callback(null, messages);
      });
    });
  },
};