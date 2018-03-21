// handle fetch and send message

const db = require('./db');

module.exports = {
  test: function (req, res) {
    db.getConnection(function (err, connection) {
        if (err) {
            res.status(501).send(err.message);
            return;
        }
        connection.query('SELECT col FROM test', function (err, results, fields) {
            if (err) {
                res.status(501).send(err.message);
                connection.release();
                return;
            }
  
            res.json({
                result: results[0].col,
                backend: 'nodejs',
            });
            connection.release();
        });
    });
  },
  fetch: function(req, res) {
    // Takes a message and saves that to the data store. 
    res.send('fetched messages!');
  },
  send: function() {
    // Loads all messages. The server should also have the capability of loading only "new" messages, i.e. messages that a user hasn't seen yet. It's up to you how to support this.
    res.send('sent message!');
  },
}