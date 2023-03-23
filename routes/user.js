const user_controller = require('../controllers/user')

const express = require('express');
const router = express.Router();

router.post('/registration', user_controller.upload, user_controller.registration);

router.post('/login', user_controller.login);

module.exports = router;