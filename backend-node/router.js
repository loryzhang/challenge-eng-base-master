const router = require('express').Router();
const db = require('./db');
const cache = require('./redis');

router.post('/login', (req, res) => {
  const { user } = req.body;
  db.getUserPreLogoutTS(user, (err, pre_ts) => {
    if (err) {
      res.status(501).send(err.message);
    }
    if (!pre_ts) {
      console.log('router', pre_ts);
      db.addUser(user, (err) => {
        if (err) {
          res.status(501).send(err.message);
        } else {
          res.json({ newUser: true });
        }
      });
  
    } else {
      // let { pre_ts } = result[1][0];
      console.log(pre_ts, Date.now()/1000);
      cache.checkMissedMessagesCountInCache(pre_ts, (err, missedMessagesCount) => {
        if (err) {
          res.status(501).send(err.message);
        } else {
          console.log('missed', missedMessagesCount);
          res.json({ missedMessagesCount, pre_ts });
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
