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
	},
	definition: function (){
		return Words.find({word: Session.get("selectedWord")});
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
		Session.set('selectedWord',this.word);

		//one card open at a time
		$('.list-group').find('.gigante').each( function( i, itemElem ) {
			$(itemElem).toggleClass('gigante');
		});
		$('.definition-ondemand').remove();

		//open current word card
		$(e.target).parentsUntil('li.list-group-item').toggleClass('gigante');
		$('.list-group').packery();


		//populates word card
		var word = Words.find({word: Session.get("selectedWord")}, {definition: 1, word: 1, _id:0});
		console.log(word.map(function(i){return i.definition;})[0]);
		var node = document.createElement('p');
		var titlenode = document.createTextNode(word.map(function(query) {return query.word;})[0] + ": ");
		var textnode = document.createTextNode(word.map(function(query){return query.definition;})[0]);
		node.className = "definition-ondemand";
		node.appendChild(titlenode);
		node.appendChild(textnode);
		e.target.parentNode.appendChild(node);
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
	},
	// 'click .wordItem': function () {
	// 	Session.set('selectedWord',this.word)
	// }
});
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
