import React, { Component } from 'react';
import axios from 'axios';
import ChatBox from './ChatBox';

class App extends Component {
  constructor() {
    super();
    this.state = {
      userName: '',
      user: null,
      err: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.logOut = this.logOut.bind(this);
    this.verifyUser = this.verifyUser.bind(this);
  }

  verifyUser() {
    axios({
      method: 'post',
      url: '/login',
      data: {
        user: this.state.userName,
      },
    })
      .then(() => {
        this.setState({ user: true });
      })
      .catch((err) => {
        this.setState({
          err: err.toString(),
        });
      });
  }

  logOut() {
    this.setState({ user: null });
  }

  handleChange(e) {
    this.setState({
      userName: e.target.value,
    });
  }

  render() {
    const { user, err, userName } = this.state;
    return (
      <div>
        { err && <div className="error">err</div> }
        { user ? <ChatBox user={userName} /> :
        <div className="login">
          <input type="text" id="user" value={userName} onChange={this.handleChange} placeholder="please use your username to log in" />
          <button id="login" onClick={this.verifyUser}>Log In</button>
        </div>
        }
      </div>
    );
  }
}

export default App;
