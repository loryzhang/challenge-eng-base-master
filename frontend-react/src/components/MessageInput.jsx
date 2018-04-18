import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { send } from '../actions';

class MessageInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
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
    const { text } = this.state;
    if (!text.length) {
      // no event will be triggered if the input is empty
      return;
    }
    const message = { text, user: this.props.user };
    this.props.send(message);
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
  send: PropTypes.func.isRequired,
};

export default connect(null, { send })(MessageInput);
