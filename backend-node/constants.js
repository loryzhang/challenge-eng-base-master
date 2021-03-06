// constants for running docker
module.exports = {
  DB_HOST: process.env.DB_HOST || 'db',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || 'testpass',
  DB: process.env.DB || 'challenge',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:13000',
  EXPRESS_PORT: process.env.EXPRESS_PORT || 8000,
  HEARTBEAT_TIMEOUT: 8000,
  HEARTBEAT_INTERVAL: 4000,
  REDIS_HOST: process.env.REDIS_HOST || 'redis',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  MESSAGE_LIMIT_IN_CACHE: 200,
};

// constants for local develop
// module.exports = {
//   DB_HOST: 'localhost',
//   DB_USER: 'root',
//   DB_PASSWORD: '',
//   DB: 'challenge',
//   CORS_ORIGIN: 'http://localhost:3000',
//   EXPRESS_PORT: 8000,
//   HEARTBEAT_TIMEOUT: 8000,
//   HEARTBEAT_INTERVAL: 4000,
//   REDIS_HOST: 'localhost',
//   REDIS_PORT: 6379,
//   MESSAGE_LIMIT_IN_CACHE: 200,
// };

