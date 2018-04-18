const redis = require('./redis');
const { insertMessageToDb, saveLogOutToDb } = require('./db');
const { MESSAGE_LIMIT_IN_CACHE } = require('./constants');

module.exports = (socket) => {
  socket.on('fetchUsers', (username, fn) => {
    socket.user = username;
    redis.sismember('users', username, (error, joined) => {
      if (error) {
        console.error(error);
      } else if (!joined) {
        socket.broadcast.emit('userJoined', username);
        redis.sadd('users', username, (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
      redis.smembers('users', (err, users) => {
        if (err) {
          console.error(err);
        } else {
          fn(users);
        }
      });
    });
  });

  socket.on('fetchMessages', (data, fn) => {
    redis.lrange('messages', 0, -1, (err, messages) => {
      if (err) {
        console.error(err);
      } else {
        const parsedMsgs = messages.map(message => JSON.parse(message));
        fn(parsedMsgs);
      }
    });
  });

  socket.on('sendMessage', (message) => {
    message.ts = Math.floor(Date.now() / 1000);
    redis.lpush('messages', JSON.stringify(message), (error) => {
      if (error) {
        console.error(error);
        return;
      }
      redis.LTRIM('messages', 0, MESSAGE_LIMIT_IN_CACHE);
      socket.emit('updateMessage', message);
      socket.broadcast.emit('updateMessage', message);
    });
    insertMessageToDb(message, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });

  socket.on('pingUser', (user) => {
    socket.user = user;
  });

  socket.on('disconnect', () => {
    redis.srem('users', socket.user, (err, userExisted) => {
      if (err) {
        console.error(err);
      } else if (userExisted) {
        socket.broadcast.emit('userLeft', socket.user);
        redis.smembers('users', (error, users) => {
          if (error) {
            console.error(error);
          } else {
            socket.broadcast.emit('updateUsers', users);
          }
        });
        const logout_ts = Math.floor(Date.now() / 1000);
        saveLogOutToDb(socket.user, logout_ts, (error) => {
          if (error) {
            console.error(error);
          }
        });
      }
    });
  });
};

