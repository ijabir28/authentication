const user_controller = require('../controllers/user');

const express = require('express');
const router = express.Router();

router.post('/registration', user_controller.upload, user_controller.registration);

router.post('/login', user_controller.login);

router.put('/:user_id', user_controller.update);

router.put('/update_image/:user_id', user_controller.upload, user_controller.update_image);

router.delete('/:user_id', user_controller.delete);

router.get('/:user_id', user_controller.profile_details);

module.exports = router;