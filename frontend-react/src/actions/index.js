import axios from 'axios';
import { LOG_IN_SUCCEED, LOG_IN_FAILED, LOG_OUT, LOAD_MORE, fetchMessages, fetchUsers, sendMessage } from '../constants';
import { initSocket, emit, disconnectSocket } from './socket';

const BACKEND_IP = 'http://localhost:18000';
// for local devleopment:
// const BACKEND_IP = 'http://localhost:8000';

axios.defaults.withCredentials = true;

const loginSuccess = (data, dispatch) => {
  initSocket(data.user, dispatch);
  emit(fetchMessages, null, dispatch);
  emit(fetchUsers, data.user, dispatch);
  dispatch({
    type: LOG_IN_SUCCEED,
    payload: data,
  });
};

const loginFailed = (message, dispatch) => {
  dispatch({
    type: LOG_IN_FAILED,
    payload: message,
  });
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
        loginFailed(data.message, dispatch);
      } else {
        loginSuccess(data, dispatch);
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
        loginFailed(data.message, dispatch);
      } else {
        loginSuccess(data, dispatch);
      }
    })
    .catch((err) => {
      console.log('request failed', err);
    });
};

export const logOut = user => (dispatch) => {
  disconnectSocket(user);
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

export const send = message => (dispatch) => {
  emit(sendMessage, message, dispatch);
};

