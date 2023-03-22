const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/user')

router.post('/registration', user_controller.registration)

module.exports = router;