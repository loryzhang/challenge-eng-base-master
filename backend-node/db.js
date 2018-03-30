const mysql = require('mysql');
const db = mysql.createPool({
  host: process.env.db || 'db',
  user: 'root',
  password: process.env.dbpassword === '' ? '' : 'testpass',
  database: 'challenge',
  multipleStatements: true,
});

module.exports = {
  checkUser: (user, callback) => {
    db.getConnection((err, connection) => {
      if (err) {
        callback(err);
        return;
      }
      connection.query('update users set ts=UNIX_TIMESTAMP( NOW() ) where user=?; SELECT pre_ts FROM users where user = ?', [user, user], (err, result) => {
        if (err) {
          callback(err);
        } else {
          console.log('indb', result);
          callback(null, result);
        }
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
      connection.query('insert into users (user, ts) values (?, UNIX_TIMESTAMP( NOW() ))', [user], (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null);
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
      connection.query('select count(*) as missedCount from messages where ts > ?', [pre_ts], (err, result) => {
        if (err) {
          callback(err);
        } else {
          callback(null, result);
        }
        connection.release();
      });
    });
  },
  insertMessageToDb: (message, callback) => {
    const { user, text, ts } = message;
    db.getConnection((err, connection) => {
      connection.query('insert into messages (user, text, ts) values (?, ?, ?)', [user, text, ts], (err) => {
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
      connection.query('update users set pre_ts = ? where user = ?', [pre_ts, user], (err) => {
        if(err) {
          callback(err);
        } else {
         callback(null);
        }
        connection.release();
      });
    });
  },

  fetchUsersCache: (callback) => {
    db.getConnection((err, connection) => {
      connection.query('select user from users order by ts desc limit 200', (err, users) => {
        if(err) {
          callback(err);
        } else {
          callback(null, users);
        }
        connection.release();
      });
    });
  },
  fetchMessagesCache: (callback)=> {
    db.getConnection((err, connection) => {
      connection.query('select user, text, ts from messages order by ts desc limit 200', (err, messages) => {
        if(err) {
          callback(err);
        } else {
          callback(null, messages.reverse());
        }
        connection.release();
      });
    });
  },
  loadMoreMessage: (ts, callback) => {
    db.getConnection((err, connection) => {
      connection.query('select user, text, ts from messages where ts < ? order by ts desc limit 100', [ts], (err, messages) => {
        if(err) {
          callback(err);
        } else {
          console.log('mesgs', messages, ts);
          callback(null, messages);
        }
        connection.release();
      });
    });
  },
};