const redis = require('redis');
const bluebird = require('bluebird');

const client = redis.createClient({host: process.env.redis || 'redis', port:6379});
client.on('err', (err) => {
  console.log(err);
});

module.exports = (socket) => {
  socket.on('addUser', (username) => {
    client.sadd('users', username);
    client.scard('users', (err, numUsers) => {
      socket.emit('userJoined', { numUsers });
      socket.broadcast.emit('userJoined', { numUsers });
    });
  });

  socket.on('sendUsers', (socketId) => {
    const users = client.smembers('users', (err, users) => {
      socket.emit('getUsers', users);
    });
  });
  socket.on('sendMessage', (message) => {
    client.lpush('messages', message, (err) => {
      socket.emit('updateMessage', message);
      socket.broadcast.emit('updateMessage', message);
    });
  });

  socket.on('fetchMessages', (start, end) => {
    client.lrange('messages', start, end, (err, messages) => {
      socket.emit('receiveMsgs', messages);
    });
  });

  socket.on('logout', (username) => {
    client.srem('users', username);
  });
};
