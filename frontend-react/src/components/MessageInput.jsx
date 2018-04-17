import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { emit } from '../actions';

class MessageInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      user: this.props.user,
    };
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
    emit('sendMessage', message);
    this.setState({ text: '' });
  }

  render() {
    return (
      <section className="send-message">
        <input id="message-input" name="text" value={this.state.text} onKeyPress={this.sendOnEnter} onChange={this.handleInputChange} />
      </section>
    );
  }
}

MessageInput.propTypes = {
  user: PropTypes.string.isRequired,
};

export default MessageInput;
