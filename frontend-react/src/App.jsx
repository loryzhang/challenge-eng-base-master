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

  componentDidMount() {
    axios('/checkSession')
      .then((result) => {
        console.log('hi', result);
        this.setState({ userName: result.data.user })
        // const { user, logout_ts, missedMessagesCount } = data;
        // this.setState({
        //   userName: user,
        //   logout_ts,
        //   missedMessagesCount,
        //   existedUser: true,
        // });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ err: err.messages });
      });
  }

  verifyUser() {
    axios({
      method: 'post',
      url: `/login`,
      data: {
        user: this.state.userName,
      },
    })
      .then(({ data }) => {
        if (data.newUser) {
          this.setState({ newUser: true });
        } else if (data.logout_ts && data.missedMessagesCount !== undefined) {
          this.setState({
            logout_ts: data.logout_ts,
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
    axios({
      method: 'post',
      url: `/logout`,
      data: {
        user: this.state.userName,
      },
    })
      .then(() => {
        this.setState({
          userName: '',
          existedUser: null,
          newUser: null,
          err: null,
          logout_ts: null,
        });
      })
      .catch((err) => {
        this.setState({ err: err.messages });
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
      logout_ts,
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
          logout_ts={logout_ts}
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
