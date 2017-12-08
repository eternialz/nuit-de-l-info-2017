const router = require('express').Router();
const db = require('../db');

router.use('/users', require('./users'))
router.use('/reports', require('./reports'))

router.get('/', function (req, res) {
    res.send('Welcome to cordon blue api!')
})

router.get('/help', function (req, res) {

    return res.json({
    "/users/register":{
        "type": "post",
        "help": "Register user",
        "data_format": {
            "name": "string",
            "email": "string",
            "password": "string"
        }},
    "/users/auth" : {
        "type": "post",
        "help": "Authentificate user",
        "data_format": {
            "email": "string",
            "password": "string"
        }},
    "/reports/create" : {
        "type": "post",
        "help": "Create one report",
        "data_format": {
            "report_type": "int/string"
        }},
    "/reports/nearby" : {
        "type": "post",
        "help": "Get Nearby Reports",
        "data_format": {
            "latitude": "float",
            "longitude": "float"
        }},
    "/reports/types" : {
        "type": "post",
        "help": "Get report type",
        "data_format": {}}
    }
    })})

router.get('/testdb', function (req, res) {
    db.query('SELECT * FROM test', [], (err, result) => {
        if(err) {
            return res.send(err.stack)
        }
        return res.send(result.rows[0])
    })
})

module.exports = router;
