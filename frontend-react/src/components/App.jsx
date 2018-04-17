import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ChatBox from './ChatBox';
import { checkSession, logIn, logOut, emit, loadMore } from '../actions';

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
    console.log(this.props);
    const {
      err,
      user,
      missedMessagesCount,
      logout_ts,
    } = this.props;
    return (
      <section id="app">
        <header>
          <div className="logo">
            <h3>Chatter Box</h3>
          </div>
          { user &&
            <div className="greeting">
              <p>Welcome {user}!</p>
              <button id="logout" onClick={this.handleLogOut}>Log Out</button>
            </div>
          }
        </header>
        { this.props.user ? <ChatBox
          user={user}
          missedMessagesCount={missedMessagesCount}
          logout_ts={logout_ts}
          handleLogOut={this.handleLogOut}
        /> :
        <section className="login">
          <input name="username" type="text" id="user" placeholder="username" onChange={this.handleInputChange} />
          <input name="email" type="email" id="email" placeholder="email" onChange={this.handleInputChange} onKeyPress={this.handleKeyPress} />
          <button onClick={this.handleLogIn}>Log In</button>
          { err && <p className="err">{err}</p> }
        </section>
        }
      </section>
    );
  }
}

const mapStateToProps = state => ({
  err: state.err,
  user: state.user,
  missedMessagesCount: state.missedMessagesCount,
  logout_ts: state.logout_ts,
});

App.propTypes = {
  err: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  missedMessagesCount: PropTypes.string.isRequired,
  logout_ts: PropTypes.number.isRequired,
  checkSession: PropTypes.func.isRequired,
  logOut: PropTypes.func.isRequired,
  logIn: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { checkSession, logIn, logOut })(App);
