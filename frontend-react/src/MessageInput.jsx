import React, { Component } from 'react';
import PropTypes from 'prop-types';

class MessageInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      user: this.props.user,
    };
    this.socket = this.props.socket;
    this.sendMessage = this.sendMessage.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.sendOnEnter = this.sendOnEnter.bind(this);
  }

  handleInputChange(e) {
    this.setState({
      text: e.target.value,
    });
  }

  sendOnEnter(e) {
    if (e.key === 'Enter') {
      this.sendMessage();
    }
  }

  sendMessage() {
    const { text, user } = this.state;
    if (!text.length) {
      // no event will be triggered if the input is empty
      return;
    }
    const message = { text, user };
    this.socket.emit('sendMessage', message);
    this.setState({ text: '' });
  }

  render() {
    return (
      <div id="messageInput">
        <input name="text" value={this.state.text} onKeyPress={this.sendOnEnter} onChange={this.handleInputChange} />
        <button onClick={this.sendMessage}>Send</button>
      </div>
    );
  }
}

MessageInput.propTypes = {
  socket: PropTypes.object.isRequired,
  user: PropTypes.string.isRequired,
};

export default MessageInput;
