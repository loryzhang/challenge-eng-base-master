const redis = require('redis');
const { fetchUsersCache, fetchMessagesCache, checkMissedCountInDB } = require('./db');

const client = redis.createClient({host: process.env.redis || 'redis', port:6379});

const multiUsers = client.multi();
const multiMsgs = client.multi();

client.flushall();

fetchUsersCache((err, users) => {
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

fetchMessagesCache((err, messages) => {
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

client.checkMissedCount = (pre_ts, callback) => {
  client.lrange('messages', -10, -10, (err, msg) => {
    if(err) {
      return callback(err);
    }
    console.log('msg', msg);
    console.log(pre_ts);
    if(!err && msg.length && JSON.parse(msg[0]).ts > pre_ts) {
      return callback(null, '10+');
    }
    else {
      checkMissedCountInDB(pre_ts, (err, result) => {
        if(err){
          return callback(err);   
        } else {
          const { missedCount } = result[0];
          return callback(null, missedCount.toString());
        }
      });
    }
  });
}

module.exports = client;