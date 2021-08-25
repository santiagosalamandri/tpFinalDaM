var express = require('express');
var app = express();
var PORT = 3000;

const cors = require('cors');
var corsOptions = {origin:'*',optionsSucessStatus:200};

app.use(cors());
//ruteo dispositivo
var routerDisp = require('./routes/dispositivo');
//ruteo dispositivo
var routerMedicion = require('./routes/medicion');
app.use(express.json());


app.use('/api/dispositivo', routerDisp);

app.use('/api/medicion', routerMedicion);

app.listen(PORT, function(req, res) {
    console.log("API Funcionando ");
});