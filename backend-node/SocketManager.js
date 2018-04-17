const redis = require('./redis');
const { insertMessageToDb, saveLogOutToDb } = require('./db');
const { MESSAGE_LIMIT_IN_CACHE } = require('./constants');

module.exports = (socket) => {
  socket.on('fetchUsers', (username, fn) => {
    console.log('fetch');
    socket.user = username;
    redis.sismember('users', username, (error, joined) => {
      if (error) {
        console.error(error);
      } else if (!joined) {
        socket.broadcast.emit('userJoined', username);
      } else {
        redis.sadd('users', username, (err) => {
          if (err) {
            console.error(err);
          } else {
            redis.smembers('users', (err, users) => {
              if (err) {
                console.error(err);
              } else {
                console.log(users);
                fn(users);
              }
            });
          }
        });
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

  socket.on('fetchMessages', (data, fn) => {
    console.log(data, fn);
    redis.lrange('messages', 0, -1, (err, messages) => {
      if (err) {
        console.error(err);
      } else {
        const pasedMsgs = messages.map(message => JSON.parse(message));
        fn(pasedMsgs);
      }
      // socket.emit('receiveMsgs', pasedMsgs);
    });
  });

  socket.on('pingUser', (user) => {
    console.log('hii');
    socket.user = user;
  });

  socket.on('disconnect', () => {
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

