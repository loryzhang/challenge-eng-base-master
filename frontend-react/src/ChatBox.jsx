import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import SocketClient from 'socket.io-client';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserList from './UserList';
import { BACKEND_IP } from './constants';

class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      users: [],
      text: '',
      messages: [],
      notice: '',
    };
    this.socket = SocketClient(BACKEND_IP);
    this.handleSocketEvents();
    this.handleInput = this.handleInput.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.send = this.send.bind(this);
    this.notify = this.notify.bind(this);
  }

  componentDidMount() {
    this.socket.emit('addUser', this.state.user);
    this.socket.emit('sendUsers');
    this.socket.emit('fetchMessages');
  }

  handleSocketEvents() {
    this.socket.on('connect', () => {
      console.log('connected client');
    });
    this.socket.on('userJoined', (user, joined) => {
      if (!joined) {
        this.setState({
          users: [user, ...this.state.users],
          numUsers: this.state.numUsers += 1,
          notice: `${user} just joined us!`,
        });
        this.notify();
      }
    });
    this.socket.on('getUsers', (users) => {
      this.setState({ users, numUsers: users.length });
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
      if (this.state.user === username) {
        this.handleLogOut();
      }
      this.setState({
        users: this.state.users.filter(user => user !== username),
        userLeaving: username,
        numUsers: this.state.users.length,
        notice: `${username} just left...`,
      });
      this.notify();
    });
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
    this.socket.emit('disconnect', this.props.user);
    this.socket.disconnect();
    this.props.logOut();
  }

  handleInput(e) {
    e.preventDefault();
    this.setState({
      text: e.target.value,
    });
  }
  notify() {
    toast(this.state.notice, { autoClose: 1500 });
  }

  render() {
    const {
      text,
      numUsers,
      userLeaving,
      users,
      messages,
    } = this.state;

    const { missedCount, pre_ts } = this.props;
    // setTimeout(this.render.bind(this), 1000);
    console.log('hi', missedCount, new Date(pre_ts));
    return (
      <div id="chat-box">
        <h1>Welcome {this.props.user}!</h1>
        { missedCount !== '0' && <p>{missedCount} messages since { moment(pre_ts).toString() }</p>}
        <ToastContainer />
        <MessageInput
          className="row-1"
          text={text}
          handleInput={this.handleInput}
          handleLogOut={this.handleLogOut}
          send={this.send}
        />
        <UserList
          users={users}
          numUsers={numUsers}
          userLeaving={userLeaving}
        />
        <MessageList messages={messages} />
      </div>
    );
  }
}

export default ChatBox;
