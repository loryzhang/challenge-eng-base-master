import axios from 'axios';
import React, { Component } from 'react';
import ChatBox from './ChatBox';
import { BACKEND_IP } from './constants';

class App extends Component {
  constructor() {
    super();
    this.state = {
      userName: '',
      existedUser: null,
      newUser: null,
      missedMessagesCount: '',
      err: null,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.pressEnterToLogin = this.pressEnterToLogin.bind(this);
    this.verifyUser = this.verifyUser.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  verifyUser() {
    axios({
      method: 'post',
      url: `${BACKEND_IP}/login`,
      data: {
        user: this.state.userName,
      },
    })
      .then(({ data }) => {
        if (data.newUser) {
          this.setState({ newUser: true });
        } else if (data.pre_ts && data.missedMessagesCount !== undefined) {
          this.setState({
            pre_ts: data.pre_ts,
            missedMessagesCount: data.missedMessagesCount,
            existedUser: true,
          });
        }
      })
      .catch((err) => {
        this.setState({ err: err.messages });
      });
  }

  handleLogOut() {
    this.setState({
      userName: '',
      existedUser: null,
      newUser: null,
      err: null,
      pre_ts: null,
    });
  }

  handleInputChange(e) {
    this.setState({
      userName: e.target.value,
    });
  }

  pressEnterToLogin(e) {
    if (e.key === 'Enter') {
      this.verifyUser();
    }
  }

  render() {
    const {
      newUser,
      existedUser,
      err,
      userName,
      missedMessagesCount,
      pre_ts,
    } = this.state;
    return (
      <div id="app">
        <div id="header">
          <h3>Chatter Box</h3>
          { err && <p className="err">{err}</p> }
          { newUser && <p>Welcome {userName}!</p> }
          { existedUser && <p>Welcome back, {userName}!</p> }
        </div>
        { newUser || existedUser ? <ChatBox
          user={userName}
          missedMessagesCount={missedMessagesCount}
          handleLogOut={this.handleLogOut}
          pre_ts={pre_ts}
        /> :
        <div id="login">
          <input className="input" type="text" id="user" value={userName} onKeyPress={this.pressEnterToLogin} onChange={this.handleInputChange} placeholder="Username" />
          <button onClick={this.verifyUser}>Log In</button>
        </div>
        }
      </div>
    );
  }
}

export default App;
