//connect to the server
var socket = io.connect("http://localhost:3000");
// what to do when we connect
socket.on('connect', function(data){
    socket.emit('join', "Client Joined");
});


document.addEventListener("DOMContentLoaded", function(){
    var mouse = {
        click: false,
        move: false,
        pos: {x:0, y:0},
        pos_prev: false
    };
    // get the canvas element
    var canvas = document.getElementById('can');
    var context = canvas.getContext('2d');
    var width = window.innerWidth;
    var height = window.innerHeight;
    
    // clear the context prior to doing anything to it
    context.clearRect(0, 0, width, height);

    //set the line color to black
    context.strokeStyle = '#000000';
    context.lineWidth = 4;

    console.log("Got canvas element"); 
    //resize the canvas to fit the entire screen
    canvas.width = width;
    canvas.height = height;
    
    canvas.onmousedown = function(e){
        mouse.click = true;
    };
    canvas.onmouseup = function(e){
        mouse.click = false;
    };
    canvas.onmousemove = function(e){
        // make it so that people with different screen sizes see the same scaled movement
        mouse.pos.x = e.clientX / width;
        mouse.pos.y = e.clientY / height;
        mouse.move = true;
    };
    
    // when someone draws 
    socket.on('draw_line', function(data){
        var line = data.line;
        context.beginPath();
        context.moveTo(line[0].x * width , line[0].y * height);
	context.moveTo(line[1].x * width , line[1].y * height);
	context.stroke();
    });

    // be checking all the time to see whether the client is drawing
    function drawLoop(){
	// check to see if the user is drawing
	if (mouse.click && mouse.move && mouse.pos_prev){
	    socket.emit('draw_line', {line: [mouse.pos, mouse.pos_prev]});
	    mouse.move = false;
	}
	mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
	setTimeout(drawLoop, 25);
    }
    console.log("Starting draw loop");
    drawLoop();
});
