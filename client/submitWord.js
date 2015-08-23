

Template.submitWord.events({
	'submit .submitWordForm': function (e) {
		var pckry = function () {
			$('.list-group').packery({
				itemSelector: '.list-group-item',
				gutter: 5,
				"rowHeight": 60
			});
		}
		var draggability = function() {
			$('.list-group').find('.list-group-item').each( function( i, itemElem ) {
			// make element draggable with Draggabilly
			var draggie = new Draggabilly( itemElem );
			// bind Draggabilly events to Packery
			$('.list-group').packery( 'bindDraggabillyEvents', draggie );
			});
		}
		e.preventDefault();
		var word = {word:e.target.submitWord.value};
		console.log(word);
		Meteor.call('wordInsert', word);
		setTimeout(function() {
			draggability();
			$('.list-group').packery();
			var itemnum = $('.list-group').find('.list-group-item').length;
			console.log($('.list-group').find('.list-group-item')[itemnum-1]);
			console.log('packary');
		}, 1000);

	}
});
