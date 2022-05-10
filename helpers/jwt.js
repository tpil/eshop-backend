const expressJwt = require('express-jwt');

function authJwt() {
    const api = process.env.API_URL;
    const secret = process.env.secret;

    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
            api + '/users/login',
            api + '/users/register'
        ]
    });
}

//expressjwt isRevoked method
async function isRevoked(req, payload, done) {
    console.log('IS REVOKED:',payload);
    if(!payload.isAdmin) {
        //reject Token
        done(null, true);
    }
    done();
}
module.exports = authJwt;