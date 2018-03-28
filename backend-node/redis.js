const redis = require('redis');
const { fetchUsersCache, fetchMessagesCache, checkMissedCountInDB } = require('./db');

const client = redis.createClient({host: process.env.redis || 'redis', port:6379});

fetchUsersCache(users => {
  JSON.parse(JSON.stringify(users)).forEach(row => {
    const { user } = row;
    client.sadd('users', user);
  });
});

fetchMessagesCache(messages => {
  JSON.parse(JSON.stringify(messages)).forEach(message => {
    console.log('incache', message, JSON.stringify(message));
    client.lpush('messages', JSON.stringify(message));
  });
});

client.on('error', err => console.log(err));

client.checkMissedCount = (pre_ts, callback) => {
  client.lrange('messages', -100, -100, (err, msg) => {
    if(err) {
      return callback(err);
    }
    if(!err && msg.length && JSON.parse(msg[0]).ts > pre_ts) {
      return callback(null, '100+');
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