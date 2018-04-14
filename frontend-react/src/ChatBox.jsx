import { ToastContainer, toast } from 'react-toastify';
import React, { Component } from 'react';
import { throttle } from 'lodash';
import PropTypes from 'prop-types';
import moment from 'moment';
import axios from 'axios';
import MessageInput from './MessageInput';
import MessageList from './MessageList';
import UserList from './UserList';

// switch BACKEND_IP for local development envirment
const BACKEND_IP = 'http://localhost:8000';
// const BACKEND_IP = 'http://localhost:18000';
class ChatBox extends Component {
  constructor(props) {
    super(props);
    const { socket, user, missedMessagesCount, logout_ts } = this.props;
    this.state = {
      users: [],
      messages: [],
      numUsers: 0,
      hasMoreMessages: true,
      missedMessagesCount,
      logout_ts,
      user,
      scrolled: false,
    };
    this.socket = socket;
    this.addSocketEventListener();
    this.loadMore = this.loadMore.bind(this);
    this.backToTop = this.backToTop.bind(this);
    // If server restart, socket will reconnect knowing who the user is
    setInterval(() => {
      this.socket.emit('pingUser', this.state.user);
    }, 1000);
  }

  componentDidMount() {
    const { user, missedMessagesCount, logout_ts } = this.state;
    this.socket.emit('addUser', user);
    this.socket.emit('sendUsers');
    this.socket.emit('fetchMessages');
    if (missedMessagesCount && logout_ts) {
      toast(`You've received ${missedMessagesCount} messages since ${moment(logout_ts * 1000).format('llll').toString()}`, { autoClose: false });
    } else if (missedMessagesCount) {
      toast(`You've received ${missedMessagesCount} messages`, { autoClose: true });
    }
    this.scroller = document.getElementById('scroller');
    this.scroller.addEventListener('scroll', throttle(() => {
      if (this.scroller.scrollTop > 100 && !this.state.scrolled) {
        this.setState({ scrolled: true });
      }
    }, 2000), { leading: false });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  addSocketEventListener() {
    // if an user opened multiple tabs, announce to other users only once
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
      // if an user opened multple tabs, force log out all the tabs at once
      if (this.props.user === username) {
        this.socket.emit('disconnect', username);
        this.socket.disconnect();
        this.props.handleLogOut();
      }
      this.setState((prevState) => {
        const users = prevState.users.filter(user => user !== username);
        const numUsers = users.length;
        return {
          users,
          numUsers,
          userLeaving: username,
        };
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

  loadMore() {
    const { messages } = this.state;
    if (!messages.length) {
      return;
    }
    const earliestMessageInState = messages[messages.length - 1];
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

  backToTop() {
    this.scroller.scrollTop = 0;
    this.setState({ scrolled: false });
  }

  render() {
    const {
      user,
      numUsers,
      userLeaving,
      users,
      messages,
      hasMoreMessages,
      scrolled,
    } = this.state;

    return (
      <section id="chat-box">
        <ToastContainer className="notice" />
        <MessageInput user={user} socket={this.socket} />
        <section className="feed">
          <MessageList
            messages={messages}
            hasMoreMessages={hasMoreMessages}
            loadMore={this.loadMore}
            backToTop={this.backToTop}
            scrolled={scrolled}
          />
          <UserList
            users={users}
            numUsers={numUsers}
            userLeaving={userLeaving}
          />
        </section>
      </section>
    );
  }
}

ChatBox.propTypes = {
  socket: PropTypes.object.isRequired,
  user: PropTypes.string.isRequired,
  missedMessagesCount: PropTypes.string.isRequired,
  logout_ts: PropTypes.number.isRequired,
  handleLogOut: PropTypes.func.isRequired,
};

export default ChatBox;
