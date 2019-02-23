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
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use('/static', express.static('public'))
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var ch = io.of('/chat');
  ch.on('connection', function (socket) {
    socket.on('sendData', function (name,data) {
      const kitty = new Cat(data);
      kitty.save().then(() => {});
      ch.emit(name+'get', data);
    });
  });
app.get('/find', function(req, res){
  
 var qr = {
    imei:req.query.i,
    $and: [
        {
            "curDateTime": {
                $gte: new Date(req.query.f) 
            }
        }
        ,
        {
            "curDateTime": {
                $lte: new Date(req.query.t)
            }
        }
    ]
}

  Cat.find(qr).exec(function(err,data){
    if(err) return res.send({msg:"err"});
    res.send(data);
  })
});
http.listen(3000, function(){
  console.log('listening on *:3000');
});
