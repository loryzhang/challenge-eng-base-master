const router = require('express').Router();
const db = require('./db');
const cache = require('./redis');

router.post('/login', (req, res) => {
  const { user } = req.body;
  let missedCount = '';
  db.checkUser(user, (err, result) => {
    if (err) {
      res.status(501).send(err.message);
    } 
    if (result && !result.length) {
      db.addUser(user, (err) => {
        if (err) {
          res.status(501).send(err.message);
        } else {
          res.json({ missedCount, pre_ts: '' });
        }
      });
    } else {
      console.log(result);
      let { pre_ts } = result[0];
      cache.checkMissedCount(pre_ts, (err, result) => {
        if(err) {
          res.status(501).send(err.message);
        } else {
          missedCount = result;
          res.json({ missedCount, pre_ts });
        }
      });
    }
  });
});

module.exports = router;
