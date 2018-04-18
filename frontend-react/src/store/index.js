import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';

const middleware = [thunk];

const store = createStore(
  rootReducer,
  undefined,
  compose(
    applyMiddleware(...middleware),
    // Debug tool extension in Chrome:
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  ),
);

export default store;
