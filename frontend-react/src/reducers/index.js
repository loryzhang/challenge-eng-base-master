import { LOG_IN_SUCCEED, LOG_IN_FAILED, LOG_OUT, LOAD_MORE, fetchMessages, fetchUsers, updateMessage, userJoined, removeUser } from '../constants';

const initialState = {
  user: null,
  err: null,
  users: [],
  messages: [],
  userLeft: null,
  hasMoreMessages: true,
  missedMessagesCount: null,
  logout_ts: null,
};

const rootReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOG_IN_SUCCEED:
      return {
        ...state,
        user: payload.user,
        missedMessagesCount: payload.missedMessagesCount,
        logout_ts: payload.logout_ts,
      };
    case LOG_IN_FAILED:
      return {
        err: payload,
      };
    case LOG_OUT:
      return {
        user: null,
      };
    case LOAD_MORE:
      return {
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
    case updateMessage:
      return {
        ...state,
        messages: [payload, ...state.messages],
      };
    case userJoined:
      return {
        ...state,
        users: [payload, ...state.users],

      };
    case removeUser:
      return {
        ...state,
        userLeft: payload,
      };
    default:
      return state;
  }
};

export default rootReducer;
