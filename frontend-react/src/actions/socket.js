import io from 'socket.io-client';

const BACKEND_IP = 'http://localhost:8000';
const events = [
  'userJoined',
  'userLeft',
  'updateMessage',
  'updateUsers',
];
const connectionOptions = { transports: ['websocket'] };
const socket = io(BACKEND_IP, connectionOptions);

export const initSocket = (user, dispatch) => {
  socket.on('connect', () => {
    console.log('connect to socket');
  });
  setInterval(() => {
    socket.emit('pingUser', user);
  }, 1000);
  events.forEach(type => socket.on(type, (payload) => {
    dispatch({ type, payload });
  }));
};

export const disconnectSocket = (user) => {
  socket.emit('disconnect', user);
  socket.disconnect();
};

export const emit = (type, data, dispatch) => {
  socket.emit(type, data, payload =>
    dispatch({
      type,
      payload,
    }));
};
