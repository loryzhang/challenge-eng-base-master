import SocketClient from 'socket.io-client';
import React, { Component } from 'react';
import axios from 'axios';
import ChatBox from './ChatBox';

// switch BACKEND_IP for local development envirment
const BACKEND_IP = 'http://localhost:8000';
// const BACKEND_IP = 'http://localhost:18000';
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
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.connectSocket = this.connectSocket.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.connectSocket = this.connectSocket.bind(this);
  }

  componentDidMount() {
    axios({
      method: 'get',
      url: `${BACKEND_IP}/checkSession`,
    })
      .then(({ data }) => {
        if (!Object.keys(data).length) {
          return;
        }
        if (data.message) {
          this.setState({ err: data.message });
        } else {
          this.connectSocket();
          const { user, missedMessagesCount, logout_ts } = data;
          this.setState({ user, missedMessagesCount, logout_ts });
        }
      })
      .catch((err) => {
        this.setState({ err: err.messages });
      });
  }

  connectSocket() {
    const connectionOptions = { transports: ['websocket'] };
    this.socket = SocketClient(BACKEND_IP, connectionOptions);
    this.socket.on('connect', () => {
      console.log('connect to socket');
    });
  }

  handleLogIn() {
    const { username, email } = this.state;
    axios({
      method: 'post',
      url: `${BACKEND_IP}/login`,
      data: { username, email },
    })
      .then(({ data }) => {
        if (data.message) {
          this.setState({ err: data.message });
        } else {
          const { user, missedMessagesCount, logout_ts } = data;
          this.connectSocket();
          this.setState({ user, missedMessagesCount, logout_ts });
        }
      })
      .catch((err) => {
        this.setState({ err: err.messages });
      });
  }

  handleLogOut() {
    const { user } = this.state;
    this.socket.emit('disconnect', user);
    this.socket.disconnect();
    axios({
      method: 'post',
      url: `${BACKEND_IP}/logout`,
      data: user,
    })
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

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleLogIn();
    }
  }

  render() {
    const {
      err,
      user,
      missedMessagesCount,
      logout_ts,
    } = this.state;
    return (
      <section id="app">
        <header>
          <div className="logo">
            <h3>Chatter Box</h3>
          </div>
          { user &&
            <div className="greeting">
              <p>Welcome {user}!</p>
              <button id="logout" onClick={this.handleLogOut}>Log Out</button>
            </div>
          }
        </header>
        { user ? <ChatBox
          user={user}
          missedMessagesCount={missedMessagesCount}
          logout_ts={logout_ts}
          socket={this.socket}
          handleLogOut={this.handleLogOut}
        /> :
        <section className="login">
          <input name="username" type="text" id="user" placeholder="username" onChange={this.handleInputChange} />
          <input name="email" type="email" id="email" placeholder="email" onChange={this.handleInputChange} onKeyPress={this.handleKeyPress} />
          <button onClick={this.handleLogIn}>Log In</button>
          { err && <p className="err">{err}</p> }
        </section>
        }
      </section>
    );
  }
}

export default App;
