const session = require("express-session");
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const express = require('express');
const path = require('path');
// const cors = require('cors');
// const RedisStore = require('connect-redis')(session);
const SocketManager = require('./SocketManager');
const router = require('./router');
const { CORS_ORIGIN, EXPRESS_PORT, REDIS_HOST, REDIS_PORT, HEARTBEAT_TIMEOUT, HEARTBEAT_INTERVAL } = require('./constants');
// const client = require('redis').createClient({ host: REDIS_HOST, port:REDIS_PORT });

// const corsOptions = {
//   origin: CORS_ORIGIN,
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204   
// }

const app = express();
const server = require('http').createServer(app);
const io = socketIO(server);

// app.use(cors(corsOptions));
app.use(session({
  // store: new RedisStore({client: client}),
  secret: 'chatterbox',
  saveUninitialized: true,
  resave: false,
  cookie: { secure: true },
}));


io.set('heartbeat timeout', HEARTBEAT_TIMEOUT);
io.set('heartbeat interval', HEARTBEAT_INTERVAL);
io.on('connection', SocketManager);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router);

server.listen(EXPRESS_PORT, function() {
    console.log(`Listening on port ${EXPRESS_PORT}`);
});