import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import axios from 'axios';
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
      hasMoreMessages: true,
      missedCount: this.props.missedCount,
      pre_ts: this.props.pre_ts,
    };
    this.socket = SocketClient(BACKEND_IP);
    this.handleSocketEvents();
    this.handleInput = this.handleInput.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.send = this.send.bind(this);
    this.notify = this.notify.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    if (this.state.missedCount !== '' && this.state.missedCount !== '0') {
      toast(`${this.state.missedCount} messages since ${moment(this.state.pre_ts * 1000).format('llll').toString()}`, { autoClose: false });
    } else if (this.state.missedCount === '0') {
      toast(`no new message since ${moment(this.state.pre_ts * 1000).format('llll').toString()}`, { autoClose: false });
    }
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

  loadMore() {
    if (!this.state.messages.length) {
      return;
    }
    const oldestMsg = this.state.messages[this.state.messages.length - 1];
    const oldestTs = oldestMsg.ts;
    axios({
      method: 'post',
      url: `${BACKEND_IP}/loadMore`,
      data: {
        ts: oldestTs,
      },
    })
      .then(({ data }) => {
        const { moreMessages, hasMoreMessages } = data;
        console.log(moreMessages, hasMoreMessages);
        this.setState({ messages: this.state.messages.concat(moreMessages), hasMoreMessages });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    const {
      text,
      numUsers,
      userLeaving,
      users,
      messages,
      hasMoreMessages,
    } = this.state;

    return (
      <div id="chat-box">
        <h1>Welcome {this.props.user}!</h1>
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
        <MessageList
          messages={messages}
          hasMoreMessages={hasMoreMessages}
          loadMore={this.loadMore}
        />
      </div>
    );
  }
}

export default ChatBox;
