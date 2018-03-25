const router = require('express').Router();
const db = require('./db');

router.post('/login', (req, res) => {
  const { user } = req.body;
  db.checkUser(user, (err, result) => {
    if (err) {
      res.status(501).send(err.message);
    }
    if (result && !result.length) {
      db.addUser(user, (err) => {
        if (err) {
          res.status(501).send(err.message);
        } else {
          res.end();
        }
      });
    } else {
      res.json(result[0]);
    }
  });
});

module.exports = router;
