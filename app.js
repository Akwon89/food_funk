var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Yelp = require('yelp');
var randomColor = require('randomcolor');
// var uuid = require('node-uuid');
 


//ownername form//
var index = require('./routes/index');
// var usersPg = require('./routes/users');


var app = express();

//socket.io request 
var server = require('http').Server(app);
var io = require('socket.io')(server);
var users = [];
var rooms = [];
var userRest = [];
var userColour = {};
var Room = require('./public/javascripts/room.js');
var RoomsRest = {};
var socketToRoom ={}; 
var numPicked =[];
var justNum = [];

function isInArray(value, array){
  return array.indexOf(value) > -1;
};
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

function getRoomFilePath (room) {
  return path.join(__dirname, 'rooms', room) +'.json';
}

//passing the socket to response in middleware
app.use(function(req, res, next){
  res.io = io;
  next();
});

io.sockets.on('connection', function(socket){
  socket.on('create room', function(newOwner, callback){
    // console.log(newOwner);
    if (newOwner.room in rooms){
      callback(false);
    } else{
      callback(true);
      var room = new Room(newOwner.room, newOwner.name, newOwner.resType, newOwner.neighbourhood);
      room.people[newOwner.name] = socket;
      // room.people[newOwner.name] = getRandomColor();
      rooms[newOwner.room] = room;
      socketToRoom[socket]= newOwner.room;
      socket.nickname = newOwner.name;
      users[socket.nickname] = socket;
      userColour[socket.nickname] = randomColourPicker;
      // getRandomColor();
      // socket.nickname = newOwner.name;
      // users[socket.nickname] = {newOwner.name: socket}
      console.log(rooms,"-----------------------", newOwner);
      socket.join(newOwner.room); 
      restaurantsList(newOwner.resType, newOwner.neighbourhood, newOwner.name, newOwner.room);
    //   console.log(restaurants);
    //   RoomsRest[newOwner.room]= restaurants;
    // console.log(RoomsRest[newOwner.room]);
    //   rooms[newOwner.room].people[newOwner.name].emit('restaurants', RoomsRest[newOwner.room]);
      updateUsernames(newOwner.room);
      }
    });


  socket.on('new user', function(data, callback){
    console.log('initial',data);
    if (!(data.room in rooms)){
      console.log("first", data);
      callback('false2');
    }else if (data.name in rooms[data.room].people) {
      console.log("second",data);
      callback('false1');
    }else {
      console.log("third",data);
      callback(true);
      // socket.nickname = data;
      // users[socket.nickname] = socket;
      users[socket] = data.name;
      socket.nickname = data.name;
      users[socket.nickname] = socket;
      userColour[socket.nickname] = randomColourPicker;
      // getRandomColor();
      rooms[data.room].people[data.name] = socket;
      // rooms[data.room].people[data.name] = getRandomColor();
      socket.join(data.room);
      socketToRoom[socket]= data.room;
      rooms[data.room].people[data.name].emit('restaurants', RoomsRest[data.room]);
      updateUsernames(data.room);
    }
  });

  socket.on('dice roll', function(numberRolled){
      console.log('number', numberRolled);
      console.log('room', socketToRoom[socket]);
      userRest[socket] = RoomsRest[socketToRoom[socket]][numberRolled - 2];
      rooms[socketToRoom[socket]].people[socket.nickname].emit('my restaurant', [RoomsRest[socketToRoom[socket]][numberRolled - 2], userColour[socket.nickname]]);
  });

  socket.on('colour change', function(numberRolled){
       io.sockets.in(socketToRoom[socket]).emit('colour change', [numberRolled - 2, userColour[socket.nickname]]);
  });


  function updateUsernames(room){
    io.sockets.in(room).emit('usernames', {users: Object.keys(rooms[room].people), colour: userColour});

  }

  socket.on('bet info', function(betVal){

    numPicked[socket.nickname] = betVal[1];
    justNum.push(parseInt(betVal[1]));
    console.log(numPicked);

    io.sockets.in(socketToRoom[socket]).emit('user bet', {bet: betVal[0], betNum: betVal[1], nickname: socket.nickname, color: userColour[socket.nickname], userRest: userRest[socket]});
  });

  // socket.on('disconnect', function(data){
  //   if(!(socket.nickname)) return;
  //   delete users[socket.nickname];
  //   updateUsernames();
  // });
  socket.on('winning number', function(num){
    console.log('in winning nums');
    io.sockets.in(socketToRoom[socket]).emit('winner',num);

  });

  socket.on('final roll', function(num,callback){
    console.log(num);
    console.log(justNum);

    // var valuesIn = Object.values(numPicked);
    // console.log(valuesIn);


    if (isInArray(num, justNum)){
      console.log("in num in justnum");
    
      callback(true);

      console.log('final roll, true')
      // var key = Object.keys(numPicked).filter(function(key){
      //   return numPicked[key] === num
      
      // console.log('.findkey', _.findKey(numPicked, num));
      // console.log('getkey', numPicked.getKeyByValue(num));
      // console.log('var key', key);
    }
    // } else {
    //   console.log('final roll, false');
    //   callback(false);
    // }
  });

  socket.on('send message', function(data) {
    console.log(users[socket]);
    console.log(users);
    // var msg = data.msg();
    io.sockets.in(socketToRoom[socket]).emit('new message', {message: data, nickname: socket.nickname, color: userColour[socket.nickname]});
    //to broadcast to only to other users and not the sender
    // socket.broadcast.emit('new message', data);
    console.log("Got msg: " + data);
  });

  var randomColourPicker = randomColor({
    luminosity: 'light',
    hue: 'green, orange, red, yellow, orange, pink, purple'

  });

  function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


  function restaurantsList(resType, neighbourhood, ownerName, roomName){
    yelp.search({ 
      sort: 2,
      // cc: 'CA',
      // region: 'Cabbagetown',
      location: ('Toronto ' + neighbourhood),
      // bounds: '43.58474,-79.639297|43.855419,-79.115623',
      term: ('restaurant ' + resType),
      category_filter: 'food',
      limit: 20 ,
    }).then(function(data_list) {
      var resData = [];
      (data_list.businesses).forEach(function(data, i){
        if (data.review_count > 5)
          {resData.push(data)} 
      });
      return resData;
    }).then(function(resData){
      RoomsRest[roomName]= resData;
      rooms[roomName].people[ownerName].emit('restaurants', RoomsRest[roomName])
    })
    .catch(function(err){
      console.log("@restaurantsList // Failed to get results", err);
    });
  };
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var yelp = new Yelp({
  consumer_key: '0bfayEOgSYYAMbv0hjXLoA',
  consumer_secret: 'IfI8QUwXU_6K_Xks8hpXWD--RJg',
  token: 'uzYa_RDBSlu2b2baPrBC_p45aEIdeW9O',
  token_secret: 'hQ9TpP9YqcQdmvfbUUCyZy5WHeg',
});


app.use('/', index);
// app.use('/room', usersPg);

// app.get('./routes/users', fun)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = {app: app, server: server};
