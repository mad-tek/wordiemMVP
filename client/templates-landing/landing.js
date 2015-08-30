Template.landing.onRendered(function() {
  //the grid
  var container = $('#landingContainer');
  var newTile = function(className, parent, width) {
    var element = document.createElement('div');
    element.className = className;
    $(element).width(width);
    if($(element).width() < 60){
      $(element).css('background-color', '#DB4243');
      element.className += ' red-tile';
    }else{
      element.className += ' blue-tile';
    }
    $(parent).append(element);
  }
  var randomNum = function(min, max) {
    return Math.floor(Math.random() * max) + min;
  }
  for(var i = 0; i < 38; i++){
    var randWidth = randomNum(30, 90);
    newTile('landing-tiles', '#landingContainer', randWidth);
  }
  container.packery({
    itemSelector: '.landing-tiles',
    gutter: 5
  });
  //the tagline
  $('#catchyWord').Morphist({
    animateIn: 'fadeInUp',
    animateOut: 'fadeOutUp',
    speed: 3000
  });
})

Template.landing.events({
  'click .blue-tile': function(event) {
    var container = $('#landingContainer');
    // remove clicked element
    container.packery( 'remove', event.target );
    // layout remaining item elements
    container.packery();
  },
  'click .red-tile': function() {
    var container = $('#landingContainer');
    var element = document.createElement('div');
    element.className = 'landing-tiles';
    element.className += 'blue-tile';
    $(element).width(Math.floor(Math.random() * 90) + 30);
    // append elements to container
    container.prepend( [element] );
    // add and lay out newly appended elements
    container.packery( 'prepended', [element] );
  },
  'submit .signupForm': function(e) {
    e.preventDefault();
    var email = e.target.signup.value;
    console.log(email);
    Meteor.call('newSignUp', email);
    $('.alert-success').toggleClass('hidden');
  }
})
