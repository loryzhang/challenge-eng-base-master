const router = require('express').Router();
const auth = require('./auth');

router.post('/login', auth.login);


module.exports = router;