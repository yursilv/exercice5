const jwt = require('jsonwebtoken');
const config = require('./config');
const constants = require('./const');

function createToken(user) {
    return jwt.sign({id: user.id}, config.secret, {expiresIn: 86400}); // the token is valid for 1 day (86400 sec)
}

/*
    if the user's token is not expired yet, it is refreshed and returned,
    otherwise an unauthorized error is thrown (so the user will have to authenticate)
*/
function checkAndRefreshToken(token) {
    try {
        const decode = jwt.verify(token, config.secret);
        return jwt.sign({id: decode.id}, config.secret, {expiresIn: 86400});
    } catch (err) {
        throw new Error(constants.unauthorized);
    }
}

module.exports = {
    createToken,
    checkAndRefreshToken
};
