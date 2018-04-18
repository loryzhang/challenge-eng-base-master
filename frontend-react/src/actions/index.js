import axios from 'axios';
import { LOG_IN_SUCCEED, LOG_IN_FAILED, LOG_OUT, LOAD_MORE, fetchMessages, fetchUsers, sendMessage } from '../constants';
import { initSocket, emit, disconnectSocket } from './socket';

const BACKEND_IP = 'http://localhost:8000';
axios.defaults.withCredentials = true;

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

export const fetch = user => (dispatch) => {
  emit(fetchMessages, null, dispatch);
  emit(fetchUsers, user, dispatch);
};

export const send = message => (dispatch) => {
  emit(sendMessage, message, dispatch);
};

