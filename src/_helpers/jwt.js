const expressJwt = require('express-jwt');
const config = require('../config/jwt.config.json');
const userService = require('../users/user.service');

function jwt() {
    const secret = config.public_token;
    return expressJwt({secret, isRevoked}).unless({
        path: [
            '/users/authenticate',
            '/users/register'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);

    if (!user) {
        return done(null, true);
    } else {
        done();
    }
}

module.exports = jwt;