var one = "<div class='side'><div class='dot c'></div></div>";
var two = "<div class='side'><div class='dot tl'></div><div class='dot br'></div></div>";
var three = "<div class='side'><div class='dot tl'></div><div class='dot c'></div><div class='dot br'></div></div>";
var four = "<div class='side'><div class='dot tl'></div><div class='dot tr'></div><div class='dot bl'></div><div class='dot br'></div></div>";
var five = "<div class='side'><div class='dot tl'></div><div class='dot tr'></div><div class='dot c'></div><div class='dot bl'></div><div class='dot br'></div></div>";
var six = "<div class='side'><div class='dot tl'></div><div class='dot tr'></div><div class='dot cl'></div><div class='dot cr'></div><div class='dot bl'></div><div class='dot br'></div></div>";
var offset = 0;
var offset2 = 0;
var offset3 = 0;
var offset4 = 0;
function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}


function roll(){
  var newSides = 50;
  var side = "";
  for(i=0; i<newSides; i++){
    var num = randomIntFromInterval(1, 6);
    if(num == 1){
      side = one;
    } else if(num == 2){
      side = two;
    } else if(num == 3){
      side = three;
    } else if(num == 4){
      side = four;
    } else if(num == 5){
      side = five;
    } else if(num == 6){
      side = six;
    }
    $('#dice1').append(side);
  }
  console.log('roll 1', num);
  offset = offset - (100*newSides);
  $('#side1:first-child').css('margin-top', offset + "%");
  return num;
}

function roll2(){
  var newSides = 50;
  var side = "";
  for(i=0; i<newSides; i++){
    var num = randomIntFromInterval(1, 6);
    if(num == 1){
      side = one;
    } else if(num == 2){
      side = two;
    } else if(num == 3){
      side = three;
    } else if(num == 4){
      side = four;
    } else if(num == 5){
      side = five;
    } else if(num == 6){
      side = six;
    }
    $('#dice2').append(side);
  }
  console.log('roll 2', num);
  offset2 = offset2 - (100*newSides);
  $('#side2:first-child').css('margin-top', offset2 + "%");
  return num;
}

function roll3(){
  var newSides = 50;
  var side = "";
  for(i=0; i<newSides; i++){
    var num = randomIntFromInterval(1, 6);
    if(num == 1){
      side = one;
    } else if(num == 2){
      side = two;
    } else if(num == 3){
      side = three;
    } else if(num == 4){
      side = four;
    } else if(num == 5){
      side = five;
    } else if(num == 6){
      side = six;
    }
    $('#dice3').append(side);
  }
  console.log('roll 3', num);
  offset3 = offset3 - (100*newSides);
  $('#side3:first-child').css('margin-top', offset3 + "%");
  return num;
}

function roll4(){
  var newSides = 50;
  var side = "";
  for(i=0; i<newSides; i++){
    var num = randomIntFromInterval(1, 6);
    if(num == 1){
      side = one;
    } else if(num == 2){
      side = two;
    } else if(num == 3){
      side = three;
    } else if(num == 4){
      side = four;
    } else if(num == 5){
      side = five;
    } else if(num == 6){
      side = six;
    }
    $('#dice4').append(side);
  }
  console.log('roll 4', num);
  offset4 = offset4 - (100*newSides);
  $('#side4:first-child').css('margin-top', offset4 + "%");
  return num;
}
// $('#roll').on('click', function(){
//   roll();
//   roll2();
// });