const Router = require('koa-router');
const queries = require('../db/queries/users');
const token = require('../utils/token');
const constants = require('../utils/const');

const router = new Router();
const BASE_URL = `/api/users`;

module.exports = router;

function inputCheck(user) {
    if (!user.login || !user.password) {
        throw new Error(constants.badRequest);
    }
}

/*
    An access token is required in the request's authorization
    header for all routes (except auth and register)
*/


// get all the users
router.get(BASE_URL, async (ctx) => {
    try {
        const t = token.checkAndRefreshToken(ctx.request.headers.authorization);
        const users = await queries.getAllUsers();
        succes(ctx, {data: {users: users, token: t}});
    } catch (err) {
        failure(ctx, err);
    }
});

// get only one user by id
router.get(`${BASE_URL}/:id`, async (ctx) => {
    try {
        const t = token.checkAndRefreshToken(ctx.request.headers.authorization);
        const user = await queries.getSingleUser(ctx.params.id);
        succes(ctx, {data: {user: user, token: t}});
    } catch (err) {
        failure(ctx, err);
    }
});

// authentication
router.post(`${BASE_URL}/auth`, async (ctx) => {
    try {
        inputCheck(ctx.request.body.user);
        const user = await queries.getAuthUser(ctx.request.body.user.login, ctx.request.body.user.password);
        const t = token.createToken(user); // creating a new access token for the user
        succes(ctx, {data: {user: user, token: t}});
    } catch (err) {
        failure(ctx, err);
    }
});

// registration
router.post(`${BASE_URL}/register`, async (ctx) => {
    try {
        inputCheck(ctx.request.body.user);
        await queries.checkLoginMail(ctx.request.body.user);
        const user = await queries.addUser(ctx.request.body.user);
        succes(ctx, {status: 201, data: {user: user}});
    } catch (err) {
        failure(ctx, err);
    }
});

// updating users profile
router.put(`${BASE_URL}/update`, async (ctx) => {
    try {
        if (!ctx.request.body.user) throw new Error(constants.badRequest);
        const t = token.checkAndRefreshToken(ctx.request.headers.authorization);
        let user = null;
        if (ctx.request.body.passwordOld && ctx.request.body.passwordNew) {
            user = await queries.updateUserInfoAndPassword(ctx.request.body.user, ctx.request.body.passwordOld, ctx.request.body.passwordNew);
        } else {
            user = await queries.updateUserInfo(ctx.request.body.user);
        }
        succes(ctx, {data: {user: user, token: t}});
    } catch (err) {
        failure(ctx, err);
    }
});

// sets the params of the response when the request was successfully completed
function succes(ctx, options) {
    if (!options.status) {
        ctx.status = 200;
    } else {
        ctx.status = options.status;
    }
    ctx.body = {
        status: 'success',
        data: options.data,
    };
}

// sets the params of the response when the request failed to complete
function failure(ctx, err) {
    // default status and error
    let status = 500;
    let error = new Error('Sorry, an error has occurred');
    if (err) {
        error = err;
        switch (err.message) {
            case constants.alreadyUsed: status = 409; break;
            case constants.wrongPassword: status = 422; break;
            case constants.userNotFound: status = 404; break;
            case constants.badRequest: status = 400; break;
            case constants.unauthorized: status = 401; break;
        }
    }
    console.log(err);
    ctx.status = status;
    ctx.body = {
        status: 'error',
        data: error.data, // undefined most of the time
        message: error.message,
    };
}
