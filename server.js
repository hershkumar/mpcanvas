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
//store all the things drawn previously
var line_history = [];

// what to do when a client connects
io.on('connection', function(client){
    // what to do when a client loads the page 
    client.on('join', function(data){
        console.log(data);
        // send the client the previously drawn lines
	for (var i in line_history){
	    client.emit('draw_line', {line: line_history[i]});
	}
    });
    client.on('draw_line', function(data){
	line_history.push(data.line);
	io.emit('draw_line', {line: data.line});
    });
    // when a client disconnects
    client.on('disconnect',function(){
	console.log("Client Disconnected");
    });
});
