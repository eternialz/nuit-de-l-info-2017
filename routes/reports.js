const router = require('express').Router();
const db = require('../db');
const utils = require('../utils')

//Fonction de vérification des chanmps
function _assertNotNull(data){
    if (isNaN(data.latitude) || isNaN(data.longitude) || !data.type) {
        return false
    }
    return true
}

router.get('/nearby', function(req, res){
    // Renvoie les reports existante dans un rayon de 20KM
    var longitude = req.query.longitude;
    var latitude = req.query.latitude;
    const earth_radius = 6371;
    const max_distance = 20;
    // http://www.movable-type.co.uk/scripts/latlong.html
    db.query('SELECT * FROM reports INNER JOIN reports_types t ON t.report_typeid=report_type \
    WHERE $1*acos(cos(pi()*$2/180)*cos(pi()*latitude/180)*cos(pi()(longitude-$3)/180) + sin(pi()*$2/180)*sin(pi()*latitude/180)) < $4 \
    AND report_time+t.avgduration > current_timestamp', // only get recent report
        [earth_radius, latitude, longitude, max_distance], (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: "SQL Error : " + err.stack
                })
            } else {
                return res.json({
                    success: true,
                    result: result
                })
            }
    });
})

router.get('/types', (req, res) => {
    db.query('SELECT report_typeid as id, name, avgduration FROM reports_types', [], (err, result) => {
        if(err) {
            return res.status(500).json({
                success: false,
                error: "SQL Error : " + err.stack
            })
        }
        return res.status(200).json({
            success: true,
            reportstypes: result.rows
        })
    })
})

router.use(utils.isLogin)

router.post('/create', function(req, res) {
    //Vérifier si les données envoyées sont null, si oui renvoyer une exception
    if(!_assertNotNull(req.body)) {
        return res.status(400).json({
            success: false,
            error : 'Data validation error'
        })
    }

    //Enregistrer le report dans la base de données
    db.query('INSERT INTO reports(latitude, longitude, report_type, userid) VALUES ($1, $2, $3, $4)', [req.body.latitude, req.body.longitude, req.body.type, req.decoded.userid], (err, result) => {
        if(err) {
            return res.json({
                success: false,
                error : 'SQL error : ' + err.stack
            })
        }
        return res.json({
            success: true
        })
    })
})

router.post('/createbyname', function(req, res) {
    //Vérifier si les données envoyées sont null, si oui renvoyer une exception
    if(!_assertNotNull(req.body)) {
        return res.status(400).json({
            success: false,
            error : 'Data validation error'
        })
    }
    db.getClient((err, client, done) => {
        client.query('SELECT report_typeid FROM reports_types WHERE name=$1', [req.body.type], (err, result) => {
            if(err) {
                done()
                return res.json({
                    success: false,
                    error : 'SQL error : ' + err.stack
                })
            }
            else if(!result.rows || !result.rows[0]) {
                done()
                return res.json({
                    success: false,
                    error : 'Invalid name!'
                })
            }
            else {
                client.query('INSERT INTO reports(latitude, longitude, report_type, userid) VALUES ($1, $2, $3, $4)', [req.body.latitude, req.body.longitude, result.rows[0].report_typeid, req.decoded.data.userid], (err2, result2) => {
                    done()
                    if(err2) {
                        return res.status(500).json({
                            success: false,
                            error : 'SQL error : ' + err2.stack
                        })
                    }
                    return res.json({
                        success: true
                    })
                })
            }
        })
    })
})

router.get('/history', (req, res) => {
    db.query('SELECT r.reportid, r.latitude, r.longitude, r.report_time, t.name FROM reports r INNER JOIN reports_types t ON t.report_typeid=r.report_type WHERE userid=$1', [req.decoded.userid], (err, result) => {
        if(err) {
            return res.json({
                success: false,
                error : 'SQL error : ' + err.stack
            })
        }
        return res.json({
            success: true,
            reports: result.rows
        })
    })
})

module.exports = router;
