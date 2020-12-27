
$(document).ready(function(){

	// Mobile menu
	$('.mobile-menu-icon').click(function(){
		$('.tm-nav').slideToggle();
	});

	$( window ).resize(function() {
		if($( window ).width() > 767) {
			$('.tm-nav').show();
		} else {
			$('.tm-nav').hide();
		}
	});

  $('body').bind('touchstart', function() {});



});

$(window).load(function() {
	$('body').addClass('loaded');
});
