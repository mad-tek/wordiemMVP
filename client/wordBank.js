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
	$(e.target).parentsUntil('li.list-group-item').toggleClass('gigante');
	$('.list-group').packery();
	},
	'mousedown .delete-item, dblclick .wordItem': function(e) {
		e.preventDefault;
		var message = 'Are you sure you want to remove "' + this.title + '"?';
		if(confirm(message)){
			Words.remove(this._id);
			return true;
		}else{
			return false;
		}
	}
	// for(var i = 0; i < document.getElementsByClassName('wordItem').length; i++){
	// 	document.getElementsByClassName('wordItem')[i].addEventListener('contextMenu', function(e){
	// 		e.preventDefault;
	// 		var message = 'Are you sure you want to remove "' + this.title + '"?';
	// 		if(confirm(message)){
	// 			Words.remove(this._id);
	// 			return true;
	// 		}else{
	// 			return false;
	// 		}
	// 	})
	// }
});
