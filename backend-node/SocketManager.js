const redis = require('./redis');
const { insertMessageToDb, saveLogOutToDb } = require('./db');

module.exports = (socket) => {
  socket.on('addUser', (username) => {
    socket.username = username;
    redis.sismember('users', username, (err, joined) => {
      if (!err) {
        redis.sadd('users', username);
        socket.broadcast.emit('userJoined', username, joined);
      }
    });
  });
  socket.on('sendUsers', () => {
    redis.smembers('users', (err, users) => {
      socket.emit('getUsers', users);
    });
  });
  socket.on('sendMessage', (message) => {
    message.ts = new Date();
    redis.lpush('messages', JSON.stringify(message), (err) => {
      socket.emit('updateMessage', message);
      socket.broadcast.emit('updateMessage', message);
    });
    insertMessageToDb(message);
  });

  socket.on('fetchMessages', (start, end) => {
    redis.lrange('messages', start, end, (err, messages) => {
      const pasedMsgs = messages.map(message => JSON.parse(message));
      socket.emit('receiveMsgs', pasedMsgs);
    });
  });
  socket.on('disconnect', () => {
    console.log('trigger disconnect');
    console.log(socket.username);
    redis.srem('users', socket.username);
    socket.broadcast.emit('removeUser', socket.username);
    const ts = new Date();
    saveLogOutToDb(socket.username, ts);
  });
};

