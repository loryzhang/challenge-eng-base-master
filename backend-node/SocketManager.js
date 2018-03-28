const redis = require('./redis');
const { insertMessageToDb, saveLogOutToDb } = require('./db');
const LIMIT = 20;

module.exports = (socket) => {
  socket.on('addUser', (username) => {
    socket.username = username;
    redis.scard('users', (err, counts) => {
      if(err) {
        console.error(err);
        return;
      }
      if(counts === LIMIT) {
        redis.spop('users', (err) => {
          if(err) {
            console.error(err);
            return;
          } else {
            redis.sismember('users', username, (err, joined) => {
              if(err) {
                console.error(err);
                return;
              }
              redis.sadd('users', username, (err) => {
                if(err) {
                  console.error(err);
                  return;
                }
              });
              socket.broadcast.emit('userJoined', username, joined);
            });
          }
        });
      }
    });
    
  });
  socket.on('sendUsers', () => {
    redis.smembers('users', (err, users) => {
      if(err) {
        console.error(err);
        return;
      }
      socket.emit('getUsers', users);
    });
  });
  socket.on('sendMessage', (message) => {
    message.ts = new Date();
    redis.lpush('messages', JSON.stringify(message), (err) => {
      if(err) {
        console.error(err);
        return;
      }
      redis.get('msgCounts', (err, counts) => {
        if(err) {
          console.error(err);
          return;
        }
        if (counts >= LIMIT) {
          console.log('inrpop')
          redis.rpop('messages', (err) => {
            if(err) {
              console.error(err);
              return;
            }
          })
        } else {
          redis.incr('msgCounts', (err) => {
            if(err) {
              console.error(err);
              return;
            }
          });
        }
      });
      socket.emit('updateMessage', message);
      socket.broadcast.emit('updateMessage', message);
    });
    insertMessageToDb(message, (err) => {
      if(err) {
        console.error(err);
      }
    });
  });
  socket.on('fetchMessages', () => {
    redis.lrange('messages', 0, -1, (err, messages) => {
      if(err) {
        console.error(err);
        return;
      }
      const pasedMsgs = messages.map(message => JSON.parse(message));
      socket.emit('receiveMsgs', pasedMsgs);
    });
  });
  socket.on('disconnect', () => {
    redis.srem('users', socket.username, (err) => {
      if(err) {
        console.error(err);
        return;
      }
    });
    socket.broadcast.emit('removeUser', socket.username);
    const ts = new Date();
    saveLogOutToDb(socket.username, ts, (err) => {
      if(err) {
        console.error(err);
      }
    });
  });
};

