import React from 'react';
import ReactDOM from 'react-dom';
// import React, { Component } from 'react';
import { Provider } from 'react-redux';
// import axios from 'axios';
import store from './store';
// import ChatBox from './ChatBox';
// import { checkSession, logIn, logOut } from '../actions/authActions';

import App from './components/App';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider >,
  document.getElementById('root'),
);

// export default connect(
//   (state) => ({
//     state: state.reducer
//   }),
//   (dispatch) => ({
//     actions: bindActionCreators(screenActions, dispatch)
//   })
// )(App);