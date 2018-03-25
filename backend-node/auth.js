//Handle user authentication
const db = require('./db');

module.exports = {
  login: (req, res) => {
    // res.send({user: "Lory"});
    const { user } = req.body;
    const query =  'SELECT user FROM users where user = ?';
    const params = [ user ];
    db.getConnection((err, connection) => {
      if (err) {
          res.status(501).send(err.message);
          return;
      }
      connection.query(query, params, (err, results) => {
        if (err) {
          res.status(501).send(err.message);
          connection.release();
          return;
        }
       
        if (!results.length) {
          const addUser = 'insert into users (user) value (?)';
          connection.query(addUser, params, (err) => {
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
};