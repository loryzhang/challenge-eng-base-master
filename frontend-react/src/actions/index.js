import axios from 'axios';
import io from 'socket.io-client';
import { LOG_IN_SUCCEED, LOG_IN_FAILED, LOG_OUT, LOAD_MORE } from '../constants';
// import { initSocket } from './socket';

const BACKEND_IP = 'http://localhost:8000';
axios.defaults.withCredentials = true;
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
  console.log('hi');
  socket.emit(type, data, payload =>
    dispatch({
      type,
      payload,
    }));
};

export const initSocket = (user, dispatch) => {
  console.log('hi', socket);
  socket.on('connect', () => {
    console.log('connect to socket');
  });
  setInterval(() => {
    socket.emit('pingUser', user);
  }, 1000);
  events.forEach(type => socket.on(type, payload => dispatch({ type, payload })));
};

export const checkSession = () => (dispatch) => {
  axios({
    method: 'get',
    url: `${BACKEND_IP}/checkSession`,
  })
    .then(({ data }) => {
      if (!Object.keys(data).length) {
        return;
      }
      if (data.message) {
        dispatch({
          type: LOG_IN_FAILED,
          payload: data.message,
        });
      } else {
        initSocket(data.user, dispatch);
        dispatch({
          type: LOG_IN_SUCCEED,
          payload: data,
        });
      }
    })
    .catch((err) => {
      console.log('request failed', err);
    });
};

export const logIn = userData => (dispatch) => {
  axios({
    method: 'post',
    url: `${BACKEND_IP}/login`,
    data: userData,
  })
    .then(({ data }) => {
      if (data.message) {
        dispatch({
          type: LOG_IN_FAILED,
          payload: data.message,
        });
      } else {
        initSocket(data.user, dispatch);
        dispatch({
          type: LOG_IN_SUCCEED,
          payload: data,
        });
      }
    })
    .catch((err) => {
      console.log('request failed', err);
    });
};

export const logOut = user => (dispatch) => {
  socket.emit('disconnect', user);
  socket.disconnect();
  axios({
    method: 'post',
    url: `${BACKEND_IP}/logout`,
    data: user,
  })
    .then(() => {
      dispatch({
        type: LOG_OUT,
      });
    })
    .catch((err) => {
      console.log('request failed', err);
    });
};

export const loadMore = earliestMessageTS => (dispatch) => {
  axios({
    method: 'post',
    url: `${BACKEND_IP}/loadMore`,
    data: {
      ts: earliestMessageTS,
    },
  })
    .then(({ data }) => {
      dispatch({
        type: LOAD_MORE,
        payload: data,
      });
    })
    .catch((err) => {
      console.error(err);
    });
};
