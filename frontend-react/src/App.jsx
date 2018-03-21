import React, { Component } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: '',
      messages: [],
    };
  }
  componentDidMount() {
    fetch('/').then((res) => {
      const { user } = res;
      this.setState({ user });
    }).catch((err) => {
      this.setState({ err });
    });
  }
  render() {
    return (
      <div>
        { this.state.err && <p>this.state.err</p> }
        { !this.state.user && <a id="login" href="/login">Log In</a> }
        <MessageInput />
        <MessageList messages={this.state.messages} />
      </div>
    );
  }
}

export default App;
