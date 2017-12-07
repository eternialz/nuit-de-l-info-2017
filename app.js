var port = process.env.PORT || 3000
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', require('./routes'));

app.listen(port, function () {
    console.log('Server running at http://127.0.0.1:' + port + '/');
})
