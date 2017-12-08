const router = require('express').Router();
const db = require('../db');
const utils = require('../utils');
const config = require('../config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function _assertNotNull(data) {
    if (!data.name || !data.email || !data.password) {
        return false
    }
    return true
}

router.post('/register', function (req, res) {
    var userName = req.body.name;
    var userEmail = req.body.email;
    var userPassword = req.body.password;
    if (!userEmail || !utils.validateEmail(req.body.email)) {
        return res.status(400).json({
            success: false,
            error: "Missing or invalid email"
        })
    }
    if (!userName) {
        return res.status(400).json({
            success: false,
            error: "Missing name"
        })
    }
    if (!userPassword || userPassword.length < 8) {
        return res.status(400).json({
            success: false,
            error: "Missing or too shot password"
        })
    }
    // Hasher le mot de pass
    var salt = bcrypt.genSaltSync(10);
    var passwordHash = bcrypt.hashSync(userPassword, salt);
    // stocker les donnée en db
    db.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [userName, userEmail, passwordHash], (err, result) => {
        if(err) {
            return res.status(500).json({
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
    if(!req.body.email || !utils.validateEmail(req.body.email) || !req.body.password) {
        return res.status(400).json({
            success: false,
            error: "Data validation error"
        })
    }
    db.query('SELECT password, userid FROM users WHERE email=$1', [req.body.email], (err, result) => {
        if(err) {
            console.error(err.stack)
            return res.status(500).json({
                success: false,
                error: "SQL Error : " + err.stack
            })
        }
        if(!result.rows || !result.rows[0]) {
            return res.json({
                success: false,
                error: "User don't exist"
            })
        }
        if(!bcrypt.compareSync(req.body.password, result.rows[0].password)) {
            return res.json({
                success: false,
                error: "Invalid password"
            })
        } else {
            var token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30), // 30 days token
                data: {userid: result.rows[0].userid}
            }, config.jwtSecret);
            return res.json({
                success: true,
                token: token
            })
        }
    })
})

module.exports = router;
