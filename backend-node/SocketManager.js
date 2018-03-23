const socketIo= require('./app').io;

module.exports = (socket) => {
  socket.on('addUser', () => {
    console.log('add user');
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
