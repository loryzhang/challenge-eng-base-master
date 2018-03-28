import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import ChatBox from './ChatBox';
import { BACKEND_IP } from './constants';

class App extends Component {
  constructor() {
    super();
    this.state = {
      userName: '',
      user: null,
      missedCount: '',
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
        const { pre_ts, missedCount } = data;
        console.log(moment(pre_ts).format(), missedCount);
        this.setState({ pre_ts, missedCount, user: true });
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
    const {
      user,
      err,
      userName,
      missedCount,
      pre_ts,
    } = this.state;
    return (
      <div id="app">
        <div id="header">
          <h3>Chatter Box</h3>
          { err && <p className="err">{err}</p> }
        </div>
        { user ? <ChatBox user={userName}
          missedCount={missedCount}
          logOut={this.logOut}
          pre_ts={pre_ts}
        /> :
        <div id="login">
          <input className="input" type="text" id="user" value={userName} onKeyPress={this.handleEnter} onChange={this.handleChange} placeholder="Username" />
          <button onClick={this.verifyUser}>Log In</button>
        </div>
        }
      </div>
    );
  }
}

export default App;
