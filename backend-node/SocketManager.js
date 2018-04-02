const redis = require('./redis');
const { insertMessageToDb, saveLogOutToDb } = require('./db');
const { MESSAGE_LIMIT_IN_CACHE } = require('./constants');

module.exports = (socket) => {
  socket.on('addUser', (username) => {
    socket.user = username;
    redis.sismember('users', username, (error, joined) => {
      if (error) {
        console.error(error);
        return;
      }
      redis.sadd('users', username, (err) => {
        if (err) {
          console.error(err);
        }
      });
      socket.broadcast.emit('userJoined', username, joined);
    });
  });

  socket.on('sendUsers', () => {
    redis.smembers('users', (err, users) => {
      if (err) {
        console.error(err);
        return;
      }
      socket.emit('getUsers', users);
    });
  });

  socket.on('sendMessage', (message) => {
    message.ts = Math.floor(Date.now() / 1000);
    redis.lpush('messages', JSON.stringify(message), (error) => {
      if (error) {
        console.error(error);
        return;
      }
      redis.get('messageCountInCache', (err, counts) => {
        if (err) {
          console.error(err);
          return;
        }
        // mantaining massage limit in cache
        if (counts >= MESSAGE_LIMIT_IN_CACHE) {
          redis.rpop('messages', (popError) => {
            if (popError) {
              console.error(popError);
            }
          });
        } else {
          redis.incr('messageCountInCache', (incError) => {
            if (incError) {
              console.error(incError);
            }
          });
        }
      });
      socket.emit('updateMessage', message);
      socket.broadcast.emit('updateMessage', message);
    });
    insertMessageToDb(message, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });

  socket.on('fetchMessages', () => {
    redis.lrange('messages', 0, -1, (err, messages) => {
      if (err) {
        console.error(err);
        return;
      }
      const pasedMsgs = messages.map(message => JSON.parse(message));
      socket.emit('receiveMsgs', pasedMsgs);
    });
  });

  socket.on('pingUser', (user) => {
    socket.user = user;
  });

  socket.on('disconnect', () => {
    console.log('when disconnect', socket.user);
    redis.srem('users', socket.user, (err) => {
      if (err) {
        console.error(err);
      }
    });
    socket.broadcast.emit('removeUser', socket.user);
    const logout_ts = Math.floor(Date.now() / 1000);
    saveLogOutToDb(socket.user, logout_ts, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
};

