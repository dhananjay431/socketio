var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const mongoose = require('mongoose');
mongoose.connect(process.env.SECRET, {useNewUrlParser: true});
const Cat = mongoose.model('Cat', {
  lat:Number,
      lng:Number,
      curDateTime:Date ,
       imei:String,
       speed:Number
  });
app.use('/static', express.static('public'))
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var ch = io.of('/chat');
  ch.on('connection', function (socket) {
    socket.on('sendData', function (name,data) {
      const kitty = new Cat(data);
      kitty.save().then(() => console.log('meow'));
    ch.emit(name+'get', data);
    });
  });
http.listen(3000, function(){
  console.log('listening on *:3000');
});