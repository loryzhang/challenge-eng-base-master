import React, { Component } from 'react';
import axios from 'axios';
import ChatBox from './ChatBox';
import { BACKEND_IP } from './constants';

class App extends Component {
  constructor() {
    super();
    this.state = {
      userName: '',
      user: null,
      err: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.verifyUser = this.verifyUser.bind(this);
    this.logOut = this.logOut.bind(this);
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
        const { pre_ts } = data;
        this.setState({ pre_ts, user: true });
      })
      .catch((err) => {
        this.setState({
          err: err.toString(),
        });
      });
  }

  logOut() {
    this.setState({
      userName: '',
      user: null,
      err: null,
      pre_ts: null,
    });
  }

  handleChange(e) {
    this.setState({
      userName: e.target.value,
    });
  }

  handleEnter(e) {
    if (e.key === 'Enter') {
      this.verifyUser();
    }
  }

  render() {
    const { user, err, userName, pre_ts } = this.state;
    return (
      <div>
        { err && <div className="error">err</div> }
        { pre_ts && <h3>last login time: {pre_ts} </h3>}
        { user ? <ChatBox user={userName} logOut={this.logOut} /> :
        <div className="login">
          <input type="text" id="user" value={userName} onKeyPress={this.handleEnter} onChange={this.handleChange} placeholder="please use your user name to log in" />
          <button id="login" onClick={this.verifyUser}>Log In</button>
        </div>
        }
      </div>
    );
  }
}

export default App;
