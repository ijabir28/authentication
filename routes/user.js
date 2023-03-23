const user_controller = require('../controllers/user')

const express = require('express');
const router = express.Router();

const multer = require("multer");
const upload = multer({ dest: "public/files" });

router.post('/registration', upload.single('photo_file'), user_controller.registration)

module.exports = router;