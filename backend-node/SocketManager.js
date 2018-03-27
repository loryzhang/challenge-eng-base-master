const redis = require('redis');
const { insertMessageToDb, saveLogOutToDb, fetchUsersCache, fetchMessagesCache } = require('./db');

const client = redis.createClient({host: process.env.redis || 'redis', port:6379});

fetchUsersCache(users => {
  JSON.parse(JSON.stringify(users)).forEach(row => {
    const { user } = row;
    client.sadd('users', user);
  });
});

fetchMessagesCache(messages => {
  JSON.parse(JSON.stringify(messages)).forEach(message => {
    client.lpush('messages', JSON.stringify(message));
  });
});

client.on('err', err => console.log('hi'));

module.exports = (socket) => {
  socket.on('addUser', (username) => {
    socket.username = username;
    client.sismember('users', username, (err, joined) => {
      if (!err) {
        client.sadd('users', username);
        socket.broadcast.emit('userJoined', username, joined);
      }
    });
  });
  socket.on('sendUsers', () => {
    client.smembers('users', (err, users) => {
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
      console.log(messages);
      const pasedMsgs = messages.map(message => JSON.parse(message));
      socket.emit('receiveMsgs', pasedMsgs);
    });
  });
  socket.on('disconnect', () => {
    console.log('trigger disconnect');
    console.log(socket.username);
    client.srem('users', socket.username);
    socket.broadcast.emit('removeUser', socket.username);
    saveLogOutToDb(socket.username);
  });
};

