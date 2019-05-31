const knex = require('../connection');
const h = require('../../utils/hash');
const constants = require('../../utils/const');

/*
    Queries for "users" table
    Note: passwords are always deleted from the response
*/

async function getAllUsers() {
    const users = await knex('users')
        .select('*');
    users.forEach(u => delete u.password);
    return users;
}

async function getSingleUser(id) {
    const user = await knex('users')
        .select('*')
        .where({ id: +id });
    if (user.length !== 0) {
        delete user[0].password;
        return user[0];
    } else {
        throw new Error(constants.userNotFound);
    }
}

async function getAuthUser(login, password) {
    const user = await knex('users')
        .select('*')
        .where({ login: login });
    if (user.length !== 0) {
        // verifying the password
        if (h.bcrypt.compareSync(password, user[0].password)) {
            delete user[0].password;
            return user[0];
        }  else {
            throw new Error(constants.wrongPassword);
        }
    } else {
        throw new Error(constants.userNotFound);
    }
}

async function addUser(user) {
    user.password = await h.hashPassword(user.password);
    const u = await knex('users')
        .insert(user)
        .returning('*');
    if (u.length !== 0) {
        delete u[0].password;
        return u[0];
    } else {
        throw new Error(constants.userNotFound);
    }
}

// throws an error if the a user with the same login or mail already exists in the database
async function checkLoginMail(user) {
    const alreadyExistsError = new Error(constants.alreadyUsed);
    alreadyExistsError.data = {};
    if (user.login) {
        const uLogin = await knex('users')
            .select('*')
            .where({ login: user.login });
        if (uLogin.length !== 0) {
            alreadyExistsError.data.login = true;
        }
    }
    if (user.mail) {
        const uMail = await knex('users')
            .select('*')
            .where({ mail: user.mail });
        if (uMail.length !== 0) {
            alreadyExistsError.data.mail = true;
        }
    }
    if (alreadyExistsError.data.login || alreadyExistsError.data.mail) {
        throw alreadyExistsError;
    }
}

// updates only user's profile info
async function updateUserInfo(user) {
    const u = await knex('users')
        .update(user)
        .where({ id: +user.id })
        .returning('*');
    if (u.length !== 0) {
        delete u[0].password;
        return u[0];
    } else {
        throw new Error(constants.userNotFound);
    }
}

// updates user's profile info and his password
async function updateUserInfoAndPassword(user, passwordOld, passwordNew) {
    const u = await knex('users')
        .select('*')
        .where({ id: +user.id });
    if (u.length !== 0 ) {
        // checking if the given old password matches the one in the table
        if (h.bcrypt.compareSync(passwordOld, u[0].password)) {
            user.password = passwordNew;
            const u = await knex('users')
                .update(user)
                .where({ id: +user.id })
                .returning('*');
            delete u[0].password;
            return u[0];
        } else {
            throw new Error(constants.wrongPassword);
        }
    } else {
        throw new Error(constants.userNotFound);
    }
}

module.exports = {
    getAllUsers,
    getSingleUser,
    addUser,
    updateUserInfo,
    updateUserInfoAndPassword,
    getAuthUser,
    checkLoginMail,
};
