var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));
const PORT = 3000;

app.get('/',function(req, res, next){
    res.sendFile(__dirname + '/index.html');
});

http.listen(PORT, '0.0.0.0', function(){
    console.log("Listening on port "+ PORT);
});


// what to do when a client connects
io.on('connection', function(client){
    console.log("Client Connected");
    client.on('join', function(data){
        console.log(data);
    });

});
