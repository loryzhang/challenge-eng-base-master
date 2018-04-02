import SocketClient from 'socket.io-client';
import React, { Component } from 'react';
import axios from 'axios';
import ChatBox from './ChatBox';
import { BACKEND_IP } from './constants';

axios.defaults.withCredentials = true;

class App extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      email: '',
      user: null,
      err: null,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.connectSocket = this.connectSocket.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  componentDidMount() {
    axios(`${BACKEND_IP}/checkSession`)
      .then(({ data }) => {
        if (!data) {
          return;
        }
        if (data.message) {
          this.setState({ err: data.message });
        } else {
          this.connectSocket();
          const { user, missedMessagesCount, logout_ts } = data;
          this.setState({ user, missedMessagesCount, logout_ts});
        }
      })
      .catch((err) => {
        this.setState({ err: err.messages });
      });
  }

  connectSocket() {
    const socket = SocketClient(BACKEND_IP);
    socket.on('connect', () => {
      console.log('connect to socket');
    });
    this.setState({ socket });
  }

  handleLogIn() {
    const { username, email } = this.state;
    axios.post(`${BACKEND_IP}/login`, { username, email })
      .then(({ data }) => {
        if (data.message) {
          this.setState({ err: data.message });
        } else {
          const { user, missedMessagesCount, logout_ts } = data;
          this.connectSocket();
          this.setState({ user, missedMessagesCount, logout_ts});
        }
      })
      .catch((err) => {
        this.setState({ err: err.messages });
      });
  }

  handleLogOut() {
    const { user, socket } = this.state;
    socket.emit('disconnect', user);
    socket.disconnect();
    axios.post(`${BACKEND_IP}/logout`, user)
      .then(() => {
        this.setState({
          username: '',
          email: '',
          user: null,
          err: null,
          missedMessagesCount: null,
          logout_ts: null,
        });
      })
      .catch((err) => {
        this.setState({ err: err.messages });
      });
  }

  handleInputChange(e) {
    if (e.target.name === 'email') {
      this.setState({ email: e.target.value });
    } else {
      this.setState({
        username: e.target.value,
      });
    }
  }

  render() {
    const {
      err,
      user,
      missedMessagesCount,
      logout_ts,
      socket,
    } = this.state;
    return (
      <div id="app">
        <div id="header">
          <h3>Chatter Box</h3>
          { user &&
          <p>Welcome {user}!<span><button onClick={this.handleLogOut}>Log Out</button></span></p> }
        </div>
        { user ? <ChatBox
          user={user}
          missedMessagesCount={missedMessagesCount}
          logout_ts={logout_ts}
          socket={socket}
          handleLogOut={this.handleLogOut}
        /> :
        <div id="login">
          <input name="username" type="text" id="user" placeholder="username" onChange={this.handleInputChange} />
          <input name="email" type="email" id="email" placeholder="email" onChange={this.handleInputChange} />
          <button onClick={this.handleLogIn}>Log In</button>
          { err && <p className="err">{err}</p> }
        </div>
        }
      </div>
    );
  }
}

export default App;
