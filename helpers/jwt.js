const { expressjwt } = require('express-jwt');

function authJwt() {
    const api = process.env.API_URL;
    const secret = process.env.secret;

    return expressjwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
            api + '/users',
            api + '/users/login',
            api + '/users/register'
        ]
    });
}

//TODO: FIX ERRROR WITH done()
//expressjwt isRevoked method
async function isRevoked(req, payload, done) {
    if(!payload.isAdmin) {
        done(null, true)
    }

    done();
}
module.exports = authJwt;