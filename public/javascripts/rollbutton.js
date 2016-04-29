$('#roll').on("click", function(event) {
  event.preventDefault();
  var flipToTop = $(this).parents('.flip-to-top');
  flipToTop.removeClass('hovering');
  $('span#roll-dice').remove();
  $('#button-append').append('<div id="bet-page-button" class="btn btn-lg"><strong>Bet</strong></button>');
});
