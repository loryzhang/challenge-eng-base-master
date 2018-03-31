const router = require('express').Router();
const db = require('./db');
const redis = require('./redis');

const sessionToUser = new Map();
router.get('/checkSession', (req, res) => {
  if (req.session) {
    res.json({ user: req.session.user });
  } else {
    res.json({ user: ''});
  }
});

router.post('/login', (req, res) => {
  const { user } = req.body;
  req.session.user = user;
  console.log(req.session);
  req.session.save();
  db.getUserPreLogoutTS(user, (err, logout_ts) => {
    if (err) {
      res.status(500).send(err.message);
    }
    if (!logout_ts) {
      db.addUser(user, (err) => {
        if (err) {
          res.status(500).send(err.message);
        } else {
          res.json({ newUser: true });
        }
      });
    } else {
      redis.checkMissedMessagesCountInCache(logout_ts, (err, missedMessagesCount) => {
        if (err) {
          res.status(500).send(err.message);
        } else {
          res.json({ missedMessagesCount, logout_ts });
        }
      });
    }
  });
});

router.post('/logout', (req, res) => {
  console.log('destroy')
  res.end();
});

router.post('/loadMore', (req, res) => {
  const { ts } = req.body;
  db.loadMoreMessage(ts, (err, messages) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      if (messages.length === 0) {
        res.json({ moreMessages: [], hasMoreMessages: false});
      } else {
        res.json({ moreMessages: Array.from(messages), hasMoreMessages: true })
      }
    }
  });
});
module.exports = router;
