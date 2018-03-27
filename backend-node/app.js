const express = require('express');
const bodyParser = require('body-parser');
const router = require('./router');
const path = require('path');
const SocketManager = require('./SocketManager');
const socketIO = require('socket.io');
const redisAdapter = require('socket.io-redis');
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204     
}
const app = express();
const server = require('http').createServer(app);
const io = socketIO(server);

app.use(cors(corsOptions));
io.set('heartbeat timeout', 8000);
io.set('heartbeat interval', 4000);
io.adapter(redisAdapter({host: process.env.redis || 'redis', port:6379}));
io.of('/').adapter.clients((err, clients) => {
  console.log(clients);
});
io.on('connection', SocketManager);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router);

server.listen(8000, function() {
    console.log('Listening on port 8000');
});