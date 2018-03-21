//Handle user authentication

const db = require('./db');

module.exports = {
  login: function(req, res) {
    //Takes a username and, if the user doesn’t already exist it, saves it to the data store
    res.end();
  },
  logout: function(req, res) {
    // logout user, distroy session
    res.end();
  },
  checkSession: function(req, res) {
    // check if the user has a not expired session
    res.end();
  },
};