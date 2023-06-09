const user_database = require('../database/user');

require('dotenv').config();
const fs = require('fs');

async function hash_password({password}) {
    const {createHmac} = await import('node:crypto');

    // console.log({password})

    return createHmac('sha256', process.env.CRYPTO_SECRET)
        .update(password)
        .digest('hex');
};

function is_existing_user({email}) {
    // console.log({email});
    return user_database.is_existing_user({email})
        .then(function (result) {
            return result;
        });
};

function get_auth_token({email, password}) {
    return is_existing_user({email})
        .then(async result => {
            if (result) {
                return user_database.get_auth_data({email})
                    .then(function (user_auth_data) {
                        // console.log({user_auth_data});

                        if (user_auth_data.password === password) {
                            const message = 'LOGIN_SUCCESSFUL';
                            const token = user_auth_data.token;
                            console.log({message});
                            return {message, token};
                        } else {
                            const message = 'INVALID_CREDENTIALS';
                            throw {message};
                        }
                    }).catch((error) => {
                        console.log(error)
                        throw error
                    });
            } else {
                const message = 'USER_DOES_NOT_EXIST';
                console.log({message});
                throw {message};
            }
        })
};

function authenticate({token}) {
    return user_database.authenticate({token})
        .then(function (auth) {
            // console.log({auth})
            return auth;
        }).catch(function (error) {
            const message = 'UNAUTHORIZED';
            console.log({message});
            throw {message: 'UNAUTHORIZED'};
        });
};

exports.registration = async function ({first_name, last_name, email, password, nid, photo, age, marital_status}) {

    const hashed_password = await hash_password({password})

    return is_existing_user({email})
        .then(async result => {
            if (!result) {
                const crypto = await import('node:crypto');
                const token = crypto.randomUUID();

                return user_database.registration({
                    token, first_name, last_name, email, password: hashed_password, nid, photo, age, marital_status
                })
                    .then((token) => {
                        const message = 'REGISTRATION_SUCCESSFUL';
                        console.log({message});
                        return {message, token};
                    }).catch((error) => {
                        fs.unlinkSync(photo);

                        console.log(error)
                        throw error;
                    });
            } else {
                fs.unlinkSync(photo);

                const message = 'USER_EXISTS';
                console.log({message});
                throw {message};
            }
        });
};

exports.login = async function ({email, password}) {
    const hashed_password = await hash_password({password})

    return get_auth_token({email, password: hashed_password})
        .then(function (result) {
            return result;
        })
};

exports.update = async function ({user, token}) {
    return authenticate({token})
        .then(function (auth) {
            const authId = auth.id;
            return user_database.update({user, authId})
                .then(function () {
                    const message = 'SUCCESSFULLY_UPDATED';
                    console.log({message});
                    return {message};
                }).catch(function (error) {
                    console.log(error);
                    throw error;
                });
        })
};

exports.update_image = async function ({user, token}) {
    return authenticate({token})
        .then(function (auth) {
            const authId = auth.id;
            return user_database.profile_details({authId})
                .then(function (profile) {
                    const old_photo = profile.photo;

                    return user_database.update({user, authId})
                        .then(function () {
                            fs.unlinkSync(old_photo);

                            const message = 'SUCCESSFULLY_UPDATED_IMAGE';
                            console.log({message});
                            return {message};
                        }).catch(function (error) {
                            console.log(error);
                            throw error;
                        });
                })

        })
};

exports.delete = async function ({token}) {
    return authenticate({token})
        .then(function (auth) {
            const authId = auth.id;
            return user_database.profile_details({authId})
                .then(function (profile) {
                    const photo = profile.photo;

                    return user_database.delete({authId, token})
                        .then(function () {
                            fs.unlinkSync(photo);

                            const message = 'SUCCESSFULLY_DELETED';
                            console.log({message});
                            return {message};
                        }).catch(function (error) {
                            console.log(error);
                            throw error;
                        });
                })
        })
};

exports.profile_details = async function ({token}) {
    return authenticate({token})
        .then(function (auth) {
            const authId = auth.id;
            return user_database.profile_details({authId})
                .then(function (result) {
                    const {id, authId, createdAt, updatedAt, ...profile} =  result.dataValues;
                    console.log({profile});
                    profile.email = auth.email;

                    return profile;
                }).catch(function (error) {
                    console.log(error);
                    throw error;
                });
        })
};