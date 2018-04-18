import { ToastContainer, toast } from 'react-toastify';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { throttle } from 'lodash';
import PropTypes from 'prop-types';
import moment from 'moment';
import MessageInput from './MessageInput';
import MessageList from './MessageList';
import UserList from './UserList';
import { fetch } from '../actions';


class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrolled: false,
    };
    // this.loadMore = this.loadMore.bind(this);
    this.backToTop = this.backToTop.bind(this);
  }

  componentDidMount() {
    const { user, missedMessagesCount, logout_ts } = this.props;
    this.props.fetch(user);

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

  // componentWillUnmount() {
  //   clearInterval(this.interval);
  // }

  backToTop() {
    this.scroller.scrollTop = 0;
    this.setState({ scrolled: false });
  }

  render() {
    console.log(this.props);
    const {
      user,
      users,
      messages,
      hasMoreMessages,
    } = this.props;
    return (
      <section id="chat-box">
        <ToastContainer className="notice" />
        <MessageInput user={user} />
        <section className="feed">
          {messages && <MessageList
            messages={messages}
            hasMoreMessages={hasMoreMessages}
            backToTop={this.backToTop}
            scrolled={this.state.scrolled}
          />}
          {users && <UserList
            users={users}
          />}
        </section>
      </section>
    );
  }
}

ChatBox.propTypes = {
  user: PropTypes.string.isRequired,
  missedMessagesCount: PropTypes.string.isRequired,
  logout_ts: PropTypes.number.isRequired,
  messages: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  hasMoreMessages: PropTypes.bool.isRequired,
  fetch: PropTypes.func.isRequired,
};

export default connect(null, { fetch })(ChatBox);
