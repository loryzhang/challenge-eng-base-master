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
      message: '',
      messages: [],
      endpoint: `${BACKEND_IP}`,
      err: null,
    };
    const { endpoint } = this.state;
    this.socket = SocketClient(endpoint);
    this.socket.on('connect', () => {
      console.log('connected client');
    });
    this.socket.emit('addUser', this.props.user);
    this.handleInput = this.handleInput.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.send = this.send.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  componentDidMount() {
    this.getUsers();
    this.getMessages();
  }

  getUsers() {
    this.socket.emit('getUsers', (res) => {
      const { users } = res;
      this.setState({ users });
    });
  }

  getMessages() {
    this.socket.emit('fetchMessages', (res) => {
      const { messages } = res;
      this.setState({ messages });
    });
  }

  send() {
    const { message } = this.state;
    this.socket.emit('sendMessage', message);
  }

  handleLogOut() {
    this.socket.emit('logout');
    this.props.logOut();
  }

  handleInput(e) {
    e.preventDefault();
    this.setState({
      message: e.target.value,
    });
  }

  render() {
    const {
      users,
      err,
      messages,
    } = this.state;
    return (
      <div>
        { err && <p>{err}</p> }
        <button id="logout" onClick={this.handleLogOut}>Log Out</button>
        <UserList users={users} />
        <MessageInput user={this.props.user} handleInput={this.handleInput} send={this.send} />
        <MessageList messages={messages} />
      </div>
    );
  }
}

export default ChatBox;
