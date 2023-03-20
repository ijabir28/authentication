const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/user')

router.get('/registration', function (req, res) {
    res.json({message: 'Registration Successful'});
})

module.exports = router;