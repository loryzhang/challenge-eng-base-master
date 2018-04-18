import { toast } from 'react-toastify';
import moment from 'moment';
import { LOG_IN_SUCCEED, LOG_IN_FAILED, LOG_OUT, LOAD_MORE, fetchMessages, fetchUsers, updateMessage, userJoined, userLeft, updateUsers } from '../constants';

const initialState = {
  user: '',
  err: '',
  users: [],
  messages: [],
  hasMoreMessages: true,
};

const rootReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOG_IN_SUCCEED:
      toast(`You've received ${payload.missedMessagesCount} messages since ${moment(payload.logout_ts * 1000).format('llll').toString()}`, { autoClose: true });
      return {
        ...state,
        user: payload.user,
      };
    case LOG_IN_FAILED:
      return {
        ...state,
        err: payload,
      };
    case LOG_OUT:
      return {
        ...state,
        user: '',
      };
    case LOAD_MORE:
      return {
        ...state,
        hasMoreMessages: payload.hasMoreMessages,
        messages: [...state.messages, ...payload.moreMessages],
      };
    case fetchMessages:
      return {
        ...state,
        messages: [...payload],
      };
    case fetchUsers:
      return {
        ...state,
        users: [...payload],
      };
    case updateUsers:
      return {
        ...state,
        users: [...payload],
      };
    case updateMessage:
      return {
        ...state,
        messages: [payload, ...state.messages],
      };
    case userJoined:
      toast(`${payload} just joined`);
      return {
        ...state,
        users: [payload, ...state.users],
      };
    case userLeft:
      toast(`${payload} just left`);
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default rootReducer;
