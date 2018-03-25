const redis = require('redis');
// const bluebird = require('bluebird');
const db = require('./db');

const insertMessage = ({ user, text, ts }) => {
  db.getConnection((err, connection) => {
    const query = 'insert into messages (user, message, ts) values (?, ?, ?)';
    const params = [user, text, ts];
    connection.query(query, params, (err) => {
      if(err) {
        console.log(err);
      }
      connection.release();
    });
  });
};

const logOut = (user) => {
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
};


const client = redis.createClient({host: process.env.redis || 'redis', port:6379});
client.on('err', (err) => {
  console.log(err);
});

module.exports = (socket) => {
  socket.on('addUser', (username) => {
    client.sadd('users', username);
    client.smembers('users', (err, users) => {
      socket.emit('userJoined', users, users.length);
      socket.broadcast.emit('userJoined', users, users.length);
    });
  });

  socket.on('sendUsers', (socketId) => {
    const users = client.smembers('users', (err, users) => {
      socket.emit('getUsers', users);
    });
  });
  socket.on('sendMessage', (message) => {
    message.ts = new Date();
    client.lpush('messages', JSON.stringify(message), (err) => {
      socket.emit('updateMessage', message);
      socket.broadcast.emit('updateMessage', message);
    });
    insertMessage(message);
  });

  socket.on('fetchMessages', (start, end) => {
    client.lrange('messages', start, end, (err, messages) => {
      const pasedMsgs = messages.map(message => JSON.parse(message));
      socket.emit('receiveMsgs', pasedMsgs);
    });
  });

  socket.on('logout', (username) => {
    client.srem('users', username);
    socket.broadcast.emit('removeUser', username);
    logOut(username);
  });
};
