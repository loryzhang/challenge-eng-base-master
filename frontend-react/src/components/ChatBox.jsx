import { ToastContainer } from 'react-toastify';
import React, { Component } from 'react';
import { throttle } from 'lodash';
import PropTypes from 'prop-types';
import MessageInput from './MessageInput';
import MessageList from './MessageList';
import UserList from './UserList';

class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrolled: false,
    };
    this.backToTop = this.backToTop.bind(this);
  }

  componentDidMount() {
    this.scroller = document.getElementById('scroller');
    this.scroller.addEventListener('scroll', throttle(() => {
      if (this.scroller.scrollTop > 100 && !this.state.scrolled) {
        this.setState({ scrolled: true });
      }
    }, 2000), { leading: false });
  }

  backToTop() {
    this.scroller.scrollTop = 0;
    this.setState({ scrolled: false });
  }

  render() {
    return (
      <section id="chat-box">
        <ToastContainer className="notice" />
        <MessageInput user={this.props.user} />
        <section className="feed">
          <MessageList
            messages={this.props.messages}
            hasMoreMessages={this.props.hasMoreMessages}
            backToTop={this.backToTop}
            scrolled={this.state.scrolled}
          />
          <UserList
            users={this.props.users}
          />
        </section>
      </section>
    );
  }
}

ChatBox.propTypes = {
  user: PropTypes.string.isRequired,
  messages: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  hasMoreMessages: PropTypes.bool.isRequired,
};

export default ChatBox;
