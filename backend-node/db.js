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
      const query =  'SELECT pre_ts FROM users where user = ?';
      connection.query(query, [ user ], (err, result) => {
        if (err) {
          callback(err);
          connection.release();
          return;
        }
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
  insertMessageToDb: ({ user, text, ts }) => {
    db.getConnection((err, connection) => {
      const query = 'insert into messages (user, message, ts) values (?, ?, ?)';
      const params = [user, text, ts];
      connection.query(query, params, (err) => {
        if(err) {
          console.log(err);
          connection.release();
        }
        connection.release();
      });
    });
  },
  saveLogOutToDb: (user) => {
    db.getConnection((err, connection) => {
      const pre_ts = new Date();
      const query = 'update users set pre_ts = ? where user = ?';
      const params = [ pre_ts, user ];
      connection.query(query, params, (err) => {
        if(err) {
          console.log(err);
        }
        connection.release();
      })
    });
  },
  saveLoginToDb: (user, room) => {
    db.getConnection((err, connection) => {
      const query = 'insert into ? (user) value (?)';
      const params = [ room, user ];
      connection.query(query, params, (err) => {
         if(err) {
           console.log(err);
         }
         connection.release();
      });
    });
  },

  fetchUsersCache: (cb) => {
    db.getConnection((err, connection) => {
      connection.query('select user from users order by ts desc limit 3', (err, users) => {
        if(err) {
          console.log(err);
        }
        connection.release();
        cb(users);
      });
    });
  },
  fetchMessagesCache: (cb)=> {
    db.getConnection((err, connection) => {
      connection.query('select * from messages order by ts desc limit 3', (err, messages) => {
        if(err) {
          console.log(err);
        }
        connection.release();
        cb(messages);
      });
    });
  },
};