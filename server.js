const express = require("express");
const app = express();
const server = require('http').Server(app);

// Para poder referenciar o css e js no html
app.use(express.static(__dirname + "/frontend"));


server.listen(3333, () => {
    console.log('Servidor iniciado na porta 3333.');
});