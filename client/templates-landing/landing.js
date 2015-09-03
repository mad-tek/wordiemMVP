var draggability = function() {
	$('#landingContainer').find('.landing-tiles').each( function( i, itemElem ) {
		// make element draggable with Draggabilly
		var draggie = new Draggabilly( itemElem );
		// bind Draggabilly events to Packery
		$('#landingContainer').packery( 'bindDraggabillyEvents', draggie );
	});
}

Template.landing.onRendered(function() {
  //auto grid
  // var newTile = function(className, parent, width) {
  //   var element = document.createElement('div');
  //   element.className = className;
  //   element.style.display = "inline-block";
  //   element.style.margin = "5px";
  //   $(element).width(width);
  //   if($(element).width() < 60){
  //     $(element).css('background-color', '#DB4243');
  //     element.className += ' red-tile';
  //   }else{
  //     element.className += ' blue-tile';
  //   }
  //   $(parent).append(element);
  // }
  // var randomNum = function(min, max) {
  //   return Math.floor(Math.random() * max) + min;
  // }
  // for(var i = 0; i < 38; i++){
  //   var randWidth = randomNum(30, 90);
  //   newTile('landing-tiles', '#landingContainer', randWidth);
  // }

  //the tagline
  $('#catchyWord').Morphist({
    animateIn: 'fadeInUp',
    animateOut: 'fadeOutUp',
    speed: 3000
  });

  //the slide
  $('#demo').slick({
    dots: true,
    infinite: true,
    slidesToShow: 1,
    adaptiveHeight: true,
    autoplay: true,
    autoplayspeed: 500,
    pauseOnHover: true,
    pauseOnDotsHover: true
  })
  document.getElementById('readerVid').play();
  document.getElementById('wordVid').play();
  $('#catchyWord').focus();
})

Template.landing.events({
  'submit .demoForm': function(e) {
    e.preventDefault();
    var word = e.target.demoSubmit.value;
    var container = $('#landingContainer');
    var element = document.createElement('div');
    var pattern=/\s/;
    if(word.match(pattern) || word === ''){
      $('#demoError').removeClass('hidden');
      return false;
    }else{
      $('#demoError').addClass('hidden');
      element.className = "blue-tile landing-tiles";
      element.innerHTML = word;
      container.prepend(element)
      container.packery( 'prepended', element );
      container.packery({
        itemSelector: '.landing-tiles',
        gutter: 5
      });
      draggability();
      e.target.demoSubmit.value = '';
    }
  },
  'click .down, click .ball1, click .ball2, click .ball3, click .spacer': function(e) {
    $('html, body').animate({
        scrollTop: $("#demo").offset().top
    }, 800);
  },
  'click .blue-tile': function(event) {
    var container = $('#landingContainer');
    // remove clicked element
    container.packery( 'remove', event.target );
    // layout remaining item elements
    $('#landingContainer').packery({
      itemSelector: '.landing-tiles',
      gutter: 5
    });
  },
  'click .red-tile': function() {
    var container = $('#landingContainer');
    var element = document.createElement('div');
    element.className = 'landing-tiles';
    element.className += 'blue-tile';
    $(element).width(Math.floor(Math.random() * 90) + 30);
    $('#landingContainer').packery();
  },
  'submit .signupForm': function(e) {
    e.preventDefault();
    var email = e.target.signup.value;
    var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
    if (email == '' || !re.test(email)){
        $('#emailError').removeClass('hidden');
        return false;
    }else{
      $('#emailError').addClass('hidden');
      console.log(email);
      Meteor.call('newSignUp', email);
      $('.alert-success').toggleClass('hidden');
    }
  }
})
