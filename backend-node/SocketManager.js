const redis = require('redis');
const { insertMessageToDb, saveLogOutToDb } = require('./db');

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
    insertMessageToDb(message);
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
    saveLogOutToDb(username);
  });

};
