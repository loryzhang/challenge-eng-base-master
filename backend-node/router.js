const router = require('express').Router();
const auth = require('./auth');

// router.get('/test', controller.test);
// router.get('/messages', controller.fetch);
// router.post('/message', controller.send);
router.get('/session', auth.checkSession);
router.post('/login', auth.login);
router.get('/logout', auth.logout);

module.exports = router;