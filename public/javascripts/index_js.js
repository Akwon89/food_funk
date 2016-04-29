$(function(){
  var socket = io.connect();
  var $messageForm = $('#send-message');
  var $messageBox = $('#message');
  var $chat = $('#chat');

  $messageForm.on('submit', function(){
    e.preventDefault();
    socket.emit('send message', $messageBox.val());
    $messageBox.val('');
  });

  socket.on('new message', function(data){
    $chat.append(data + '<br />');
  });
});