var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use('/static', express.static('public'))
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.of('/chat').on('connection', function (socket) {
    //socket.emit('news', { hello: 'world' });
    socket.on('get', function (data) {
        socket.emit(data+'get', { hello: 'world' });
    });

    socket.on('sendData', function (name,data) {
        socket.emit(name+'get', data);
    });

  });



http.listen(3000, function(){
  console.log('listening on *:3000');
});