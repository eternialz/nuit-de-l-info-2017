const router = require('express').Router();
const db = require('../db');
const utils = require('../utils');
const bcrypt = require('bcryptjs');

function _assertNotNull(data) {
    if (!data.name || !data.email || !data.password){
        return false
    }
    return true
}

router.post('/register', function (req, res) {
    var userName = req.body.name;
    var userEmail = req.body.email;
    var userPassword = req.body.password;
    if (!_assertNotNull(req.body) || !utils.validateEmail(userEmail) || userPassword.lenght < 8) {
        return res.json({
            success: false,
            error: "Data validation error"
        })
    }
    // Hasher le mot de pass
    var salt = bcrypt.genSaltSync(10);
    console.log(userPassword, userEmail, userName, salt)
    var passwordHash = bcrypt.hashSync(userPassword, salt);
    // stocker les donnée en db
    db.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [userName, userEmail, passwordHash], (err, result) => {
        if(err) {
            return res.json({
                success: false,
                error: "SQL Error : " + err.stack
            })
        }
        return res.json({
            success: true
        })
    })
})

router.post('/auth', function (req, res) {
    var userName = req.body.name;
    var userEmail = req.body.email;
    var userPassword = req.body.password;
    //
}

module.exports = router;
