$(document).ready(function() {

  $(document).keypress(function(e) {
    if(e.which == 13) {
      $('#grid').toggleClass('show').css('height', $(document).height());
    }
  });

  $(".picture").fluidbox();

});

function add(first, second) {
  return first+second;
}

var sum = add(5,4);
