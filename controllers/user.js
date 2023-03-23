const user_service = require('../services/user')

exports.registration = function (req, res) {
    const user = {first_name, last_name, email, password, nid, age, marital_status} = req.body;
    user.photo = 'public/files/' + req.file.filename;

    user_service.registration(user).then(function (result) {
        res.status(200).send(result);
    }).catch((error) => {
        res.status(409).send(error);
    });
};

// exports.upload = function (req, res, next) {
//     const multer = require("multer");
//
//     const DIR = 'public/files';
//
//     let storage = multer.diskStorage({
//         destination: function (req, file, callback) {
//             callback(null, DIR);
//         },
//         filename: function (req, file, cb) {
//             console.log(file.originalname);
//             cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//         }
//     });
//
//     let upload = multer({storage: storage});
// }