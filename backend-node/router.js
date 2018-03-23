const router = require('express').Router();
const auth = require('./auth');

router.get('/session', auth.checkSession);
router.post('/login', auth.login);
router.get('/logout', auth.logout);

module.exports = router;