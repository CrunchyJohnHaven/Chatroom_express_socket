var express = require('express');
var session = require('express-session');
var path = require('path');
var bodyparser = require('body-parser');
var app = express();
session.x = "";
var users = [];
var chat = [];



app.use(session({secret: 'coding'}));
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'./static')));
app.set('views', path.join(__dirname,'./views'));
app.set('view engine', 'ejs');


app.get('/', function(req,res){
    console.log('index route - server.js');
    res.render('index');
});
app.post('/speed', function(req,res){
    console.log('result route - server.js');
    res.render('result');
});
var server = app.listen(8000, function(){
    console.log('EPIC BUTTON listening on port 8000');
});
var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket){
    console.log('Client/socket is connected');
    console.log('Client/socket id is: ', socket.id);
    socket.on('speed', function(data){
        console.log('login - server side', data);
        session.x = data.name;
        console.log("session.x: ", session.x);
        users.push({name:session.x, about:data.about});
        // session.x = data.name;
        // session.y = data.about;
        console.log('session.name: ', session.x);
        
    });
    socket.on('got_user', function(data){
        console.log('server - got_a_new_user');
        console.log('server - got_a_new_user:', data);

        io.emit('new_user', users);
    });
    socket.on('post_message', function(data){
        chat.push({name: session.x, message: data.message});
        console.log("chat : ", chat);
        io.emit('messages', chat);
    });
    });
  

   