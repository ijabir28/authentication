const user_service = require('../services/user')

const multer = require("multer");
const path = require("path");
const DIR = 'public/files';

let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, DIR);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + (parseInt(Math.random() * 1000).toString()) + path.extname(file.originalname));
    }
});

let upload = multer({storage: storage});


exports.registration = function (req, res, next) {
    const user = {first_name, last_name, email, password, nid, age, marital_status} = req.body;
    user.photo = path.join(DIR, req.file.filename);

    user_service.registration(user).then(function (result) {
        res.status(200).send(result);
    }).catch((error) => {
        res.status(409).send(error);
    });
};

exports.upload = function (req, res, next) {
    upload.single('photo')(req, res, next);
}