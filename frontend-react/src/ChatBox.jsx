import React, { Component } from 'react';
import SocketClient from 'socket.io-client';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserList from './UserList';
import { BACKEND_IP } from './constants';

class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      text: '',
      messages: [],
      endpoint: `${BACKEND_IP}`,
      err: null,
    };
    const { endpoint } = this.state;
    this.socket = SocketClient(endpoint);
    this.socket.on('connect', () => {
      console.log('connected client');
    });

    this.socket.on('userJoined', (users, numUsers) => {
      this.setState({ users, numUsers });
    });
    this.socket.on('getUsers', (users) => {
      this.setState({ users });
    });
    this.socket.on('receiveMsgs', (messages) => {
      this.setState({ messages });
    });
    this.socket.on('updateMessage', (message) => {
      this.setState({
        messages: [message, ...this.state.messages],
      });
    });
    this.socket.on('removeUser', (username) => {
      this.setState({
        users: this.state.users.filter(user => user !== username),
      });
    });

    this.handleInput = this.handleInput.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.send = this.send.bind(this);
  }

  componentDidMount() {
    this.socket.emit('addUser', this.props.user);
    this.socket.emit('sendUsers', this.socket.id);
    this.socket.emit('fetchMessages', 0, -1);
  }

  send() {
    if (!this.state.text.length) {
      return;
    }
    const message = {
      text: this.state.text,
      user: this.props.user,
    };
    this.socket.emit('sendMessage', message);
    this.setState({ text: '' });
  }

  handleLogOut() {
    this.socket.emit('logout', this.props.user);
    this.socket.disconnect();
    this.props.logOut();
  }

  handleInput(e) {
    e.preventDefault();
    this.setState({
      text: e.target.value,
    });
  }

  render() {
    const {
      text,
      numUsers,
      users,
      err,
      messages,
    } = this.state;
    return (
      <div>
        { err && <p>{err}</p> }
        <button id="logout" onClick={this.handleLogOut}>Log Out</button>
        <UserList users={users} numUsers={numUsers} />
        <MessageInput
          text={text}
          user={this.props.user}
          handleInput={this.handleInput}
          send={this.send}
        />
        <MessageList messages={messages} />
      </div>
    );
  }
}

export default ChatBox;
