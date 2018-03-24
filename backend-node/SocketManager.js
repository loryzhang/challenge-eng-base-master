const redis = require('redis');
const numUsers = 0;

module.exports = (socket) => {
  let addedUser = false;
  socket.on('addUser', (username) => {
    console.log('adding user', username);
    if (addedUser) return;
    // we store the username in the socket session for this client
    socket.username = username;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('userJoined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  socket.on('getUsers', () => {
    console.log('get users');
  });
  socket.on('sendMessage', () => {
    console.log('send message');
  });

  socket.on('fetchMessages', () => {
    console.log('fetch messages');
  });

  socket.on('logout', () => {

  });
};
