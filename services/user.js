const user_database = require('../database/user');
require('dotenv').config();

async function hash_password({password}) {
    const {createHmac} = await import('node:crypto');

    // console.log({password})

    return createHmac('sha256', process.env.CRYPTO_SECRET)
        .update(password)
        .digest('hex');
}

function is_existing_user({email}) {
    // console.log({email});
    return user_database.is_existing_user({email})
        .then(function (result) {
            return result;
        });
}

function get_auth_token({email, password}) {
    return is_existing_user({email})
        .then(async result => {
            if (result) {
                return user_database.get_auth_data({email})
                    .then(function (user_auth_data) {
                        // console.log({user_auth_data});

                        if (user_auth_data.password === password) {
                            return user_auth_data.token;
                        }
                    });
            }
            ;
        })
}


exports.registration = async function ({first_name, last_name, email, password, nid, photo, age, marital_status}) {

    const hashed_password = await hash_password({password})

    // const token = get_auth_token({email, password: hashed_password});

    return is_existing_user({email})
        .then(async result => {
            if (!result) {
                const crypto = await import('node:crypto');
                const token = crypto.randomUUID();

                return user_database.registration({
                    token,
                    first_name,
                    last_name,
                    email,
                    password: hashed_password,
                    nid,
                    photo,
                    age,
                    marital_status
                })
                    .then((token) => {
                        const message = 'REGISTRATION_SUCCESSFUL';
                        console.log({message});
                        return {message: 'REGISTRATION_SUCCESSFUL', token};
                    }).catch((error) => {
                        console.log(error)
                        throw error;
                    });
            } else {
                const message = 'USER_EXISTS';
                console.log({message});
                throw {message};
            }
        });
}