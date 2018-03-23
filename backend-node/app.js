const express = require('express');
const bodyParser = require('body-parser');
const router = require('./router');
const path = require('path');
const SocketManager = require('./SocketManager');
const socketIO = require('socket.io');

const app = express();
const server = require('http').createServer(app);
const io = socketIO(server);

io.on('connection', SocketManager);
app.use(express.static(path.join(__dirname, '/../frontend-react/public/')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router);

server.listen(8000, function() {
    console.log('Listening on port 8000');
});

module.exports.io = io;