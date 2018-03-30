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
    
    if (!result[1].length) {
      console.log('router', result[1]);
      db.addUser(user, (err) => {
        if (err) {
          res.status(501).send(err.message);
        } else {
          res.json({ missedCount, pre_ts: '' });
        }
      });
  
    } else {
      let { pre_ts } = result[1][0];
      console.log(pre_ts, Date.now()/1000);
      cache.checkMissedCount(pre_ts, (err, result) => {
        if (err) {
          res.status(501).send(err.message);
        } else {
          missedCount = result;
          console.log('missed', missedCount);
          res.json({ missedCount, pre_ts });
        }
      });
    }
  });
});

router.post('/loadMore', (req, res) => {
  const { ts } = req.body;
  db.loadMoreMessage(ts, (err, result) => {
    if (err) {
      res.status(501).send(err.message);
    } else {
      if (result.length === 0) {
        console.log('result in router', result)
        res.json({ moreMessages: [], hasMoreMessages: false});
      } else {
        res.json({ moreMessages: Array.from(result), hasMoreMessages: true })
      }
    }
  });
});
module.exports = router;
