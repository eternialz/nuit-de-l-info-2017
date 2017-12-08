const jwt = require('jsonwebtoken');
const config = require('./config');

exports.validateEmail = function (email)
{
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function isLogin(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token) {
        jwt.verify(token, config.jwtSecret, function(err, decoded) {
            if(err) {
                return res.status(403).json({
                    success: false,
                    error: 'User not login'
                })
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).json({
            success: false,
            error: 'A token is require for authentification'
        })
    }
}

exports.isLogin = isLogin;
