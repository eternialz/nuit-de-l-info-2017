const router = require('express').Router();
const db = require('../db');

//Fonction de vérification des chanmps
function _assertNotNull(data){
  if (!data.position || !data.type){
    return false
  }
  return true
}

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



module.exports = router;
