import { ToastContainer, toast } from 'react-toastify';
import SocketClient from 'socket.io-client';
import React, { Component } from 'react';
import moment from 'moment';
import axios from 'axios';
import { BACKEND_IP } from './constants';
import MessageInput from './MessageInput';
import MessageList from './MessageList';
import UserList from './UserList';

class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      text: '',
      messages: [],
      hasMoreMessages: true,
    };
    this.socket = SocketClient(BACKEND_IP);
    this.addSocketEventListener();
    this.handleInputChange = this.handleInputChange.bind(this);
    this.quitChatterBox = this.quitChatterBox.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.loadMore = this.loadMore.bind(this);
    // In case of server restart
    setInterval(() => {
      this.socket.emit('pingUser', this.props.user);
    }, 1000);
  }

  componentDidMount() {
    if (this.props.missedMessagesCount && this.props.logout_ts) {
      toast(`${this.props.missedMessagesCount} messages since ${moment(this.props.logout_ts * 1000).format('llll').toString()}`, { autoClose: false });
    }
    this.socket.emit('addUser', this.props.user);
    this.socket.emit('sendUsers');
    this.socket.emit('fetchMessages');
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  addSocketEventListener() {
    this.socket.on('connect', () => {
      console.log('connected client');
    });
    this.socket.on('userJoined', (user, alreadyJoined) => {
      if (!alreadyJoined) {
        this.setState((prevState) => {
          const { numUsers, users } = prevState;
          return {
            users: [user, ...users],
            numUsers: numUsers + 1,
          };
        });
        toast(`${user} just joined us!`, { autoClose: 1500 });
      }
    });
    this.socket.on('removeUser', (username) => {
      // if the same user opened multple tabs for the same chat room
      // then log out all the tabs
      if (this.props.user === username) {
        this.quitChatterBox();
      }
      this.setState((prevState) => {
        const users = prevState.users.filter(user => user !== username);
        const numUsers = users.length;
        return {
          users,
          numUsers,
          userLeaving: username,
        }
      });
      toast(`${username} just left...`, { autoClose: 1500 });
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
  }

  sendMessage() {
    if (!this.state.text.length) {
      // no event will be triggered if the input is empty
      return;
    }
    const message = {
      text: this.state.text,
      user: this.props.user,
    };
    this.socket.emit('sendMessage', message);
    this.setState({ text: '' });
  }

  quitChatterBox() {
    this.socket.emit('disconnect', this.props.user);
    this.socket.disconnect();
    this.props.handleLogOut();
  }

  handleInputChange(e) {
    this.setState({
      text: e.target.value,
    });
  }

  loadMore() {
    if (!this.state.messages.length) {
      return;
    }
    const earliestMessageInState = this.state.messages[this.state.messages.length - 1];
    const earliestMessageTS = earliestMessageInState.ts;
    axios({
      method: 'post',
      url: `${BACKEND_IP}/loadMore`,
      data: {
        ts: earliestMessageTS,
      },
    })
      .then(({ data }) => {
        const { moreMessages, hasMoreMessages } = data;
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
        <ToastContainer />
        <MessageInput
          className="row-1"
          text={text}
          handleInputChange={this.handleInputChange}
          sendMessage={this.sendMessage}
        />
        <UserList
          users={users}
          numUsers={numUsers}
          userLeaving={userLeaving}
          quitChatterBox={this.quitChatterBox}
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
