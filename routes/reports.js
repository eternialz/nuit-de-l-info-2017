const router = require('express').Router();
const db = require('../db');
const utils = require('../utils')

//Fonction de vérification des chanmps
function _assertNotNull(data){
  if (!data.position || !data.type){
    return false
  }
  return true
}

router.use(utils.isLogin)

router.post('/save', function(req, res){
    var position = req.body.position
    var type = req.body.type

    //Vérifier si les données envoyées sont null, si oui renvoyer une exception
    if(_assertNotNull(req.body)){
      return res.json({
        success: false,
        error : 'Data validation error'
      })
    }

    //Enregistrer le report dans la base de données
    db.query('INSERT INTO report(position, type) VALUES ($1, $2)', [position, type], (err, result) => {
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

router.get('/nearby', function(req, res){
    // Renvoie les reports existante dans un rayon de 20KM
    var longitude = req.query.longitude;
    var latitude = req.query.latitude;
    const earth_radius = 6371;
    const max_distance = 20;
    // http://www.movable-type.co.uk/scripts/latlong.html
    db.query('SELECT * from reports WHERE $1*acos(cos(pi()*$2/180))*cos(pi()*latitude/180)*cos(pi()(longitude-$3)/180) + sin(pi()*$2/180)*sin(pi()*latitude/180)) < $4',
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

module.exports = router;
