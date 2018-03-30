const redis = require('redis');
const { fetchUsersFromDbToCache, fetchMessagesFromDbToCache, checkMissedMessagesCountInDB } = require('./db');

const client = redis.createClient({host: process.env.redis || 'redis', port:6379});

const multiUsers = client.multi();
const multiMsgs = client.multi();

client.flushall();

fetchUsersFromDbToCache((err, users) => {
  if (err) {
    console.error(err);
    return;
  }
  Array.from(users).forEach(row => {
    const { user } = row;
    multiUsers.sadd('users', user);
  });
  multiUsers.exec((err) => {
    if(err) {
      console.error(err);
    }
  })
});

fetchMessagesFromDbToCache((err, messages) => {
  if (err) {
    console.error(err);
    return;
  }
  client.set('msgCounts', messages.length);
  Array.from(messages).forEach(message => {
    multiMsgs.lpush('messages', JSON.stringify(message));
  });
  multiMsgs.exec((err) => {
    if(err) {
      console.error(err);
    }
  })
});

client.on('error', err => console.error(err));

client.checkMissedMessagesCountInCache = (pre_ts, callback) => {
  client.lrange('messages', -100, -100, (err, message) => {
    if(err) {
      return callback(err);
    }
    if(!err && message.length && JSON.parse(message[0]).ts > pre_ts) {
      return callback(null, '100+');
    }
    else {
      checkMissedMessagesCountInDB(pre_ts, (err, missedMessagesCount) => {
        if(err){
          return callback(err);   
        } else {
          return callback(null, missedMessagesCount);
        }
      });
    }
  });
}

module.exports = client;