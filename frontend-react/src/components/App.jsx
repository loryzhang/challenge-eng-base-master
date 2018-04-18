import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ChatBox from './ChatBox';
import { checkSession, logIn, logOut } from '../actions';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  componentDidMount() {
    this.props.checkSession();
  }

  handleLogIn() {
    const { username, email } = this.state;
    this.props.logIn({ username, email });
  }

  handleLogOut() {
    const { user } = this.state;
    this.props.logOut(user);
  }

  handleInputChange(e) {
    if (e.target.name === 'email') {
      this.setState({ email: e.target.value });
    } else {
      this.setState({
        username: e.target.value,
      });
    }
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleLogIn();
    }
  }

  render() {
    return (
      <section id="app">
        <header>
          <div className="logo">
            <h3>Chatter Box</h3>
          </div>
          { this.props.user &&
            <div className="greeting">
              <p>Welcome {this.props.user}!</p>
              <button id="logout" onClick={this.handleLogOut}>Log Out</button>
            </div>
          }
        </header>
        { this.props.user ? <ChatBox
          messages={this.props.messages}
          user={this.props.user}
          users={this.props.users}
          missedMessagesCount={this.props.missedMessagesCount}
          logout_ts={this.props.logout_ts}
          hasMoreMessages={this.props.hasMoreMessages}
          handleLogOut={this.handleLogOut}
        /> :
        <section className="login">
          <input name="username" type="text" id="user" placeholder="username" onChange={this.handleInputChange} />
          <input name="email" type="email" id="email" placeholder="email" onChange={this.handleInputChange} onKeyPress={this.handleKeyPress} />
          <button onClick={this.handleLogIn}>Log In</button>
          { this.props.err && <p className="err">{this.props.err}</p> }
        </section>
        }
      </section>
    );
  }
}

const mapStateToProps = state => ({
  err: state.err,
  user: state.user,
  users: state.users,
  missedMessagesCount: state.missedMessagesCount,
  logout_ts: state.logout_ts,
  messages: state.messages,
  hasMoreMessages: state.hasMoreMessages,
});

App.propTypes = {
  err: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  messages: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  hasMoreMessages: PropTypes.bool.isRequired,
  missedMessagesCount: PropTypes.string.isRequired,
  logout_ts: PropTypes.number.isRequired,
  checkSession: PropTypes.func.isRequired,
  logOut: PropTypes.func.isRequired,
  logIn: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { logIn, checkSession, logOut })(App);
