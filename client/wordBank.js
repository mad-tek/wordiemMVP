var packery = function () {
	$('.list-group').packery({
		itemSelector: '.list-group-item',
		gutter: 5
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


Template.wordBank.helpers({
	words: function() {
		return Words.find();
	}
});


Template.wordBank.onRendered(function() {
	packery();
	draggability();
});



Template.wordBank.events({
	'click .wordItem': function (e) {
		e.preventDefault();
	var word = ($(".wordItem").text());
	console.log(word)
	}
});
