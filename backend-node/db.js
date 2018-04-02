const mysql = require('mysql');
const { DB, DB_HOST, DB_USER, DB_PASSWORD } = require('./constants');
const db = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB,
  multipleStatements: true,
});

module.exports = {
  findUserByUsername: (user, callback) => {
    db.getConnection((err, connection) => {
      if (err) {
        callback(err);
        return;
      }
      connection.query('select user, email from users where user=?', [user], (err, results) => {
        if(err) {
          callback(err);
        } else {
          if(!results.length) {
            callback(null, null, null);
          } else {
            callback(null, results[0].user, results[0].email);
          }
        }
        connection.release();
      });
    })
  },
  getUserPreLogoutTS: (user, callback) => {
    db.getConnection((err, connection) => {
      if (err) {
        callback(err);
        return;
      }
      connection.query('update users set login_ts=UNIX_TIMESTAMP( NOW() ) where user=?; SELECT logout_ts FROM users where user = ?', [user, user], (err, results) => {
        if (err) {
          callback(err);
        } else {
          if(!results[1].length) {
            callback(null, null);
          } else {
            const { logout_ts } = results[1][0];
            callback(null, logout_ts);
          }
        }
        connection.release();
      });
    });
  },
  addUser: (user, email, callback) => {
    db.getConnection((err, connection) => {
      if (err) {
        callback(err);
        return;
      }
      connection.query('insert into users (user, login_ts, email) values (?, UNIX_TIMESTAMP( NOW() ), ?)', [user, email], (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
        connection.release();
      });
    });
  },
  checkMissedMessagesCountInDB: (logout_ts, callback) => {
    db.getConnection((err, connection) => {
      if (err) {
        callback(err);
        return;
      }
      connection.query('select count(*) as missedMessagesCount from messages where ts > ?', [logout_ts], (err, result) => {
        if (err) {
          callback(err);
        } else {
          const { missedMessagesCount } = result[0];
          callback(null, missedMessagesCount);
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
  saveLogOutToDb: (user, logout_ts, callback) => {
    db.getConnection((err, connection) => {
      connection.query('update users set logout_ts = ? where user = ?', [logout_ts, user], (err) => {
        if(err) {
          callback(err);
        } else {
         callback(null);
        }
        connection.release();
      });
    });
  },

  fetchUsersFromDbToCache: (callback) => {
    db.getConnection((err, connection) => {
      connection.query('select user from users where login_ts > logout_ts limit 200', (err, users) => {
        if(err) {
          callback(err);
        } else {
          callback(null, users);
        }
        connection.release();
      });
    });
  },
  fetchMessagesFromDbToCache: (callback)=> {
    db.getConnection((err, connection) => {
      connection.query('select * from messages order by ts desc limit 200', (err, messages) => {
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
          callback(null, messages);
        }
        connection.release();
      });
    });
  },
};
