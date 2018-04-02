const router = require('express').Router();
const db = require('./db');
const redis = require('./redis');
const passport = require('./passport');

router.get('/checkSession', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/messages');
  } else {
    res.redirect('/login');
  }
});

router.post('/login', passport.authenticate('loginUser', {
  failureRedirect: '/login',
  successRedirect: '/messages',
  failureFlash: true,
}));

router.get('/login', (req, res) => {
  const err = { message: req.flash('error')[0] };
  res.json(err);
});

router.get('/messages', (req, res) => {
  const { user } = req.session.passport;
  db.getUserPreLogoutTS(user, (error, logout_ts) => {
    if (error) {
      res.status(500).send(error.message);
    } else {
      redis.checkMissedMessagesCountInCache(logout_ts, (err, missedMessagesCount) => {
        if (err) {
          res.status(500).send(err.message);
        } else {
          res.json({ missedMessagesCount, logout_ts, user });
        }
      });
    }
  });
});

router.post('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

router.post('/loadMore', (req, res) => {
  const { ts } = req.body;
  db.loadMoreMessage(ts, (err, messages) => {
    if (err) {
      res.status(500).send(err.message);
    } else if (messages.length === 0) {
      res.json({ moreMessages: [], hasMoreMessages: false });
    } else {
      res.json({ moreMessages: Array.from(messages), hasMoreMessages: true });
    }
  });
});

module.exports = router;
