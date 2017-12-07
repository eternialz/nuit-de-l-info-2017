const router = require('express').Router();
const db = require('../db');

router.get('/', function (req, res) {
    res.send('Welcome to cordon blue api!')
})

router.get('/testdb', function (req, res) {
    db.query('SELECT * FROM test', [], (err, result) => {
        if(err) {
            return res.send(err.stack)
        }
        return res.send(result.rows[0])
    })
})

module.exports = router;
