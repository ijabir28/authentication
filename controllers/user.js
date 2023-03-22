const user_service = require('../services/user')

exports.registration = function (req, res) {
    const user = {first_name, last_name, email, password, nid, photo, age, marital_status} = req.body;

    user_service.registration(user).then(function (result) {
        res.status(200).send(result);
    }).catch((error) => {
        res.status(409).send(error);
    });
};