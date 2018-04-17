import io from 'socket.io-client';

const BACKEND_IP = 'http://localhost:8000';

const events = [
  'userJoined',
  'removeUser',
  'updateMessage',
];
const connectionOptions = { transports: ['websocket'] };
const socket = io(BACKEND_IP, connectionOptions);
console.log(socket);
// socket.on('connect', () => {
//   console.log('connect to socket');
// });

export const emit = (type, data) => (dispatch) => {
  socket.emit(type, data, payload =>
    dispatch({
      type,
      payload,
    }));
};

export const initSocket = (user, dispatch) => {
  console.log('hi');
  socket.on('connect', () => {
    console.log('connect to socket');
  });
  setInterval(() => {
    socket.emit('pingUser', user);
  }, 1000);
  events.forEach(type => socket.on(type, payload => dispatch({ type, payload })));
};
