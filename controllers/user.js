const user_service = require('../services/user');

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const DIR = 'uploads';

let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        fs.mkdirSync(DIR, { recursive: true })
        callback(null, DIR);
    }, filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + (parseInt(Math.random() * 1000).toString()) + path.extname(file.originalname));
    }
});

let upload = multer({storage: storage});

exports.upload = function (req, res, next) {
    return upload.single('photo')(req, res, next);
};

exports.registration = function (req, res) {
    const user = {first_name, last_name, email, password, nid, age, marital_status} = req.body;
    user.photo = path.join(DIR, req.file.filename);

    console.log({user});

    return user_service.registration(user)
        .then(function (result) {
            res.status(200).send(result);
        }).catch((error) => {
            res.status(409).send(error);
        });
};

exports.login = function (req, res) {
    const credential = {email, password} = req.body;

    return user_service.login(credential)
        .then(function (result) {
            res.status(200).send(result);
        }).catch((error) => {
            res.status(401).send(error);
        });
};

exports.update = function (req, res) {
    const user = {first_name, last_name, email, nid, age, marital_status} = req.body;
    const token = req.params.user_id;

    return user_service.update({user, token})
        .then(function (result) {
            res.status(200).send(result);
        }).catch(function (error) {
            res.status(412).send(error);
        });
};

exports.update_image = function (req, res) {
    const token = req.params.user_id;
    const user = {};
    user.photo = path.join(DIR, req.file.filename);

    return user_service.update_image({user, token})
        .then(function (result) {
            res.status(200).send(result);
        }).catch(function (error) {
            res.status(412).send(error);
        });
};

exports.delete = function (req, res) {
    const token = req.params.user_id;

    return user_service.delete({token})
        .then(function (result) {
            res.status(200).send(result);
        }).catch(function (error) {
            res.status(403).send(error);
        });
};

exports.profile_details = function (req, res) {
    const token = req.params.user_id;

    return user_service.profile_details({token})
        .then(function (result) {
            res.status(200).send(result);
        }).catch(function (error) {
            res.status(403).send(error);
        });
};