const session = require('express-session');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const flash = require('connect-flash');
const express = require('express');
const cors = require('cors');
const RedisStore = require('connect-redis')(session);

const { CORS_ORIGIN, EXPRESS_PORT, REDIS_HOST, REDIS_PORT, HEARTBEAT_TIMEOUT, HEARTBEAT_INTERVAL } = require('./constants');
const client = require('redis').createClient({ host: REDIS_HOST, port: REDIS_PORT });
const SocketManager = require('./SocketManager');
const passport = require('./passport');
const router = require('./router');

const app = express();
const server = require('http').createServer(app);

const corsOptions = {
  origin: CORS_ORIGIN,
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

const io = socketIO(server);
app.use(session({
  store: new RedisStore({ client }),
  secret: 'chatterbox',
  saveUninitialized: false,
  resave: false,
  cookie: { maxAge: 60000 }, // session expired in 10 mins
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

io.set('heartbeat timeout', HEARTBEAT_TIMEOUT);
io.set('heartbeat interval', HEARTBEAT_INTERVAL);
io.on('connection', SocketManager);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router);

server.listen(EXPRESS_PORT, () => {
  console.log(`Listening on port ${EXPRESS_PORT}`);
});
