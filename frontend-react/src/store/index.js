import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';

const initialState = {
  // username: '',
  // email: '',
  user: null,
  // err: null,
  // users: [],
  // messages: [],
  // numUsers: 0,
  // hasMoreMessages: true,
  // missedMessagesCount: null,
  // logout_ts: null,
  // scrolled: false,
};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  ),
);


export default store;
