
$(function(){
  // var User = require('./user.js');
  var socket = io.connect();
  var users = $('#users')

  var username = $('#name');
  var userForm = $('#user-info');

  var messageForm = $('#send-message');
  var messageBox = $('#message');
  var chat = $('#chat');

  var ownerForm = $('#owner-form');
  var ownername = $('#ownername');
  var roomname = $('#roomname');
  var yelpForm = $('#yelp-form');
  var resType = $('#res-type');
  var neighbourhood = $('#neighbourhood');
  var newOwner = {};
  var boardUsers = {};

  var bgArray = ['bg1.jpg', 'bg2.jpg'];
  var bg = bgArray[Math.floor(Math.random() * bgArray.length)];
  var path = '/images/';

  $(document).on('click', '#bet-page-button', function(){
    console.log('clicked');
    $('#board').hide();
    $('#player-piece-row').show();
    $('#player-piece').show();
    $('#player-bet').show();
  });


  ownerForm.on('submit', function(e){
    e.preventDefault();
    newOwner['name'] = ownername.val();
    newOwner['room'] = roomname.val();
    console.log(newOwner);
    $('#ownername-container').hide();
    $('#yelp-container').show();
  });

  yelpForm.on('submit', function(e){
    e.preventDefault();
    newOwner['resType'] = resType.val();
    newOwner['neighbourhood'] = neighbourhood.val();
    console.log(newOwner);
    socket.emit('create room', newOwner, function(){
      $('#yelp-container').hide();
      $('#board').show();
      $('#users').show();
      $('#the_container').show();
      $('video').remove();
      $('body').css({
        'background-image': 'url('+path+bg+')'
      });
      $('#welcome-message').html("Welcome, <strong style='color:rgb(245, 218, 129);'>" + newOwner['name']+ "</strong>! Your room: <strong style='color:rgb(245, 218, 129);'>"+ newOwner['room'] +"</strong>");
      $('#room-button').html('<button class="btn btn-warning" >Copy URL</button>');
      newOwner = {};
      // socket.emit('submitResName', 'jap food', function(data) {
          //     console.log(data)
      // });
    });
  });

  userForm.on('submit', function(e){
    e.preventDefault();
    console.log($('#hidden').val());
    socket.emit('new user', {name: username.val(),room: $('#hidden').val() }, function(data){
      if (data) {
        $('#username-container').remove();
        $('video').remove();
        $('#the_container').show();
        $('#board').show();
        $('#users').show();
        $('body').css({
        'background-image': 'url('+path+bg+')'
        });
        // $('#welcome-message').html("Welcome, <strong style='color:rgb(245, 218, 129);'>" + name + "</strong>! Your room: <strong style='color:rgb(245, 218, 129);'>"+ room +"</strong>");
      }else if ('false1') {
        // socket.on('usernames', function(data){
        //   if(data.length === 1){
        // socket.emit('submitResName', 'jap food', function(data) {
        //     console.log(data)
          // });
        //   }
        // });

      }else if ('false2') {
        //page doesnt exist 
      }
    })
    console.log(username.val());
    username.val('');
  });

  socket.on('winner',function(data){
    console.log(data);
    $('#display-text').html("Winning Number is: " + data + "! Bon Appetit!");
  });

  $('#bet-roll').on('click', function(e){
    e.preventDefault();
    var finalRoll = (roll3()) + (roll4());
    console.log("bet roll", finalRoll);

    socket.emit('final roll', finalRoll, function(data){
      if (data){
        console.log('its working');
        $('#bet-dice').hide();
        socket.emit('winning number', finalRoll);
        
        //hide dice
      } 
      // else if(false) {
      //   //sorry no one has number roll again
      // }
    });

    // console.log(numberRolled);
    // socket.emit('dice roll', numberRolled);
    // socket.emit('colour change', numberRolled)

  });

  $('#roll').on('click', function(e){
    e.preventDefault();
    var numberRolled = (roll()) + (roll2());

    console.log(numberRolled);
    socket.emit('dice roll', numberRolled);
    socket.emit('colour change', numberRolled);
    // , function(data){
    //   if (data) {
    //     $('#username-container').remove();
    //     $('video').remove();
    //     $('#the_container').show();
    //     $('#board').show();
    //     $('#users').show();
    //   }else if ('false1') {
    //     // socket.on('usernames', function(data){
    //     //   if(data.length === 1){
    //     // socket.emit('submitResName', 'jap food', function(data) {
    //     //     console.log(data)
    //       // });
    //     //   }
    //     // });

    //   }else if ('false2') {
    //     //page doesnt exist 
    //   }

  });



  socket.on('colour change', function(data){
    console.log(data);
    for (var i = 0; i <= (data[0]); i++ ){
      setTimeout($('#cell'+i).animate({ backgroundColor: data[1]}, 1000),2000*i);
      // $('#cell'+i).effect("highlight", {date[1]}, 3000);

      // $('#cell'+i).css('background-color', 'rgba(26, 60, 72, 0.7)');
      // setTimeout($('#cell'+i).css('background-color', data[1]), 2000);
    }
    for (var i = 0; i < (data[0]); i++ ){
      setTimeout($('#cell'+i).animate({ backgroundColor: "rgba(26, 60, 72, 0.7)"}, 2000),3000*i);
    }
  });


   socket.on('user bet',function(data){
    console.log(data);
    console.log(data.userRest.name);

    $('#all-bets').append('<div id="players-bet" style="background-color:'+data.color+';"><p class="bet-name" id="bet-name" >'+ data.userRest.name+ '</p><div id="bet-image"><img class="img-responsive" id="pick-img" src='+ data.userRest.image_url+'></div><div class="row" ><div class="col-xs-8"><div id="bet-rating" ><img class="img-responsive" id="bet-rating-img" src='+data.userRest.rating_img_url+'></div></div><div class ="col-xs-4"><p id="bet-review-count">'+ data.userRest.review_count+'</p></div><div id="pick-container" ><p id="players-name">User: <strong style="color:'+data.color+';">'+ data.nickname +'</strong></p><p id="bet">Bet: '+ data.bet +'</p><p id="bet-number">Number: '+ data.betNum +'</p></div></div></div>'
      );

  });


  /////////////////////////////

  $('#bet-form').on('submit', function(e){
    e.preventDefault();
    socket.emit('bet info', [$('#bet').val(), $('#number').val()]);

    $('#player-piece-row').hide();
    $('#player-piece').hide();
    $('#all-bets').show();
    $('#bet-dice').show();
    $('#hide-all-bets').show();
    $('#display-bar-container').show();
    
  });

  $('#owner-bet-form').on('submit', function(e){
    e.preventDefault();
    socket.emit('bet info', [$('#bet').val(), $('#number').val()]);

    $('#player-piece-row').hide();
    $('#player-piece').hide();
    $('#all-bets').show();
    $('#bet-dice').show();
    $('#owner-hide-all-bets').show();
    $('#display-bar-container').show();
    
  });

///////////////////////

  socket.on('my restaurant', function(data){
    console.log(data[0]);
    console.log(data[1]);

    $('#piece-name').append('<a id="piece-link" target="_blank" href=' + data[0].url + '>' + data[0].name + '</a>');
    $('#piece-picture').append('<img id="piece-img" class="img-responsive" src=' + data[0].image_url + '>');
    $('#piece-rating').append('<img id="piece-rating-img" class="img-responsive" src=' + data[0].rating_img_url + '>');
    $('#piece-review-count').append(data[0].review_count);
    $('#player-piece').css({
      'background-color': data[1]
    });
  });


  socket.on('usernames', function(data){
    console.log(data);
    var user_list = "";
    for (var i = 0; i < (data.users).length; i++) {
      user_list += '<h4 style="color:'+ data.colour[data.users[i]] +';">' + data.users[i] + '</h4>'
      console.log(data.colour[data.users[i]]);
    };
    $('.users').html(user_list);
  });

  socket.on('restaurants', function(restaurants){
    var restaurants_list = restaurants;
    restaurants_list.forEach(function(restaurant, index){
    //   $('#cell'+index).append('<img src=' + restaurant.image_url +'>')
    //   $('#cell'+index).append('<div style="font-size: 1.5rem;">'+ restaurant.name + '</div>')
    //   $('#cell'+index).append('<div style="font-size: 1rem;"><img src='+ restaurant.rating_img_url + '> ' + restaurant.review_count + '</div>')
    // })
    // if ((restaurant.name).length <= 11) {
      $('#cell-name'+index).append(restaurant.name)
      // } //other lengths once merged can do, to chang font size
      $('#cell-image'+index).append('<img class="image-responsive cell-image" src=' + restaurant.image_url +'>')
      $('#cell-image-rating'+index).append('<img id="cell-rating-image" class="image-responsive" src=' + restaurant.rating_img_url + '>')
      $('#cell-number-of-ratings'+index).append(restaurant.review_count)
    })
  });


  messageForm.on('submit', function(e){
    e.preventDefault();
    socket.emit('send message', messageBox.val());
    console.log(messageBox.val());
    messageBox.val('');
  });

  socket.on('new message', function(data){
    console.log('got' +data);
    $('#chat-box').append('<strong style="color:'+ data.color +';">' + data.nickname + '</strong>: ' + data.message + '<br />');
  });
});