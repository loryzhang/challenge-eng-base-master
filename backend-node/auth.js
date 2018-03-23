//Handle user authentication
const db = require('./db');

module.exports = {
  login: (req, res) => {
    const { user } = req.body;
    const query =  `SELECT user FROM users where user = '${user}'`;
    db.getConnection((err, connection) => {
      if (err) {
          res.status(501).send(err.message);
          return;
      }
      connection.query(query, (err, results) => {
        if (err) {
            console.log('err when query', query);
            res.status(501).send(err.message);
            connection.release();
            return;
        }
        console.log('results', results);
        if (!results.length) {
          const addUser = `insert into users (user) value ('${user}')`;
          connection.query(addUser, (err) => {
            if (err) {
              res.status(501).send(err.message);
              connection.release();
              return;
            }
            res.end();
            connection.release();
          });
        } else {
          res.end();
          connection.release();
        }
        
      });
    });
  },
  logout: (req, res) => {
    // logout user, distroy session
    res.end();
  },
  checkSession: (req, res) => {
    // check if the user has a not expired session
    res.end();
  },
};