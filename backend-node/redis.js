const redis = require('redis');
const { fetchUsersFromDbToCache, fetchMessagesFromDbToCache, checkMissedMessagesCountInDB } = require('./db');
const { REDIS_HOST, REDIS_PORT } = require('./constants');

const client = redis.createClient({ host: REDIS_HOST, port: REDIS_PORT });
// flush redis when server restart
client.flushall();
const multiUsers = client.multi();
const multiMsgs = client.multi();

fetchUsersFromDbToCache((err, users) => {
  if (err) {
    console.error(err);
    return;
  }
  Array.from(users).forEach((row) => {
    const { user } = row;
    multiUsers.sadd('users', user);
  });
  multiUsers.exec((error) => {
    if (error) {
      console.error(error);
    }
  });
});

fetchMessagesFromDbToCache((err, messages) => {
  if (err) {
    console.error(err);
    return;
  }
  client.set('messageCountInCache', messages.length);
  Array.from(messages).forEach((message) => {
    multiMsgs.lpush('messages', JSON.stringify(message));
  });
  multiMsgs.exec((error) => {
    if (error) {
      console.error(error);
    }
  });
});

client.on('error', err => console.error(err));

client.checkMissedMessagesCountInCache = (logout_ts, callback) => {
  client.lrange('messages', -100, -100, (err, message) => {
    if (err) {
      return callback(err);
    }
    if (!err && message.length && JSON.parse(message[0]).ts > logout_ts) {
      return callback(null, '100+');
    }
    checkMissedMessagesCountInDB(logout_ts, (error, missedMessagesCount) => {
      if (error) {
        return callback(error);
      }
      return callback(null, missedMessagesCount);
    });
  });
};

module.exports = client;
