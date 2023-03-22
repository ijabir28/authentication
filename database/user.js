const {Sequelize, DataTypes} = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_SCHEMA, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST, dialect: 'mysql'
});

const Auths = sequelize.define("auths", {
    email: {
        type: DataTypes.STRING, allowNull: false
    }, password: {
        type: DataTypes.STRING, allowNull: false
    }, token: {
        type: DataTypes.STRING, allowNull: false
    }
});
const Profiles = sequelize.define("profiles", {
    first_name: {
        type: DataTypes.STRING, allowNull: false
    }, last_name: {
        type: DataTypes.STRING, allowNull: false
    }, nid: {
        type: DataTypes.INTEGER, allowNull: false
    }, photo: {
        type: DataTypes.STRING, allowNull: false
    }, age: {
        type: DataTypes.INTEGER, allowNull: false
    }, marital_status: {
        type: DataTypes.STRING, allowNull: false
    }
});

// Table create korar shomoy foreign key add korle shomossha hocche. Pore korle hocche na
Auths.hasOne(Profiles, {onDelete: 'CASCADE'});

sequelize.sync({alter: true}).then(() => {
    console.log('Tables Created Successfully');
})
    .catch((error) => {
        console.error('Unable to create the tables : ', error);
    });


exports.is_existing_user = function ({email}) {
    return Auths.findOne({
        where: {
            email
        }
    }).then(auth => {
        return (!!auth);
    }).catch((error) => {
        console.error('Failed to retrieve data : ', error);
    });
};

exports.registration = async function ({
                                           token,
                                           first_name,
                                           last_name,
                                           email,
                                           password,
                                           nid,
                                           photo,
                                           age,
                                           marital_status
                                       }) {
    // console.log({ token, first_name, last_name, email, password, nid, photo, age, marital_status })

    let transaction;

    try {
        transaction = await sequelize.transaction();
        const auth = await Auths.create({
            email, password, token
        }, {transaction});

        console.log(typeof (nid));

        await Profiles.create({
            first_name, last_name, nid, photo, age, marital_status, authId: auth.id
        }, {transaction});

        // console.log({auth: auth.dataValues, profile: profile.dataValues});

        await transaction.commit();

        return auth.dataValues.token;
    } catch (error) {
        console.log('error');

        if (transaction) {
            await transaction.rollback();
        }
    }
};


exports.get_auth_data = async function ({email}) {
    return await Auths.findOne({
        where: {
            email
        }
    }).then(auth => {
        return auth.dataValues;
    }).catch((error) => {
        console.error('Failed to retrieve data : ', error);
    });
}

