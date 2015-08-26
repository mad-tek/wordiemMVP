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
var cardHandler = function(wordcard) {
	//open current word card
	$(wordcard).parent().toggleClass('gigante');
	$('.list-group').packery();

	//populates word card
	var word = Words.find({word: Session.get("selectedWord")}, {definition: 1, word: 1, _id:0});
	var node = document.createElement('p');
	var titlenode = document.createTextNode(word.map(function(query) {return query.word;})[0] + ": ");
	var textnode = document.createTextNode(word.map(function(query){return query.definition;})[0]);
	node.className = "definition-ondemand";
	node.appendChild(titlenode);
	node.appendChild(textnode);
	wordcard.parentNode.appendChild(node);

	//delete word button
	var closediv = document.createElement('a');
	var closebutton = document.createTextNode("delete this word");
	closediv.className = "close-button";
	closediv.appendChild(closebutton);
	wordcard.parentNode.appendChild(closediv);
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
	'click .wordItem, click .list-group-item': function (e) {
		e.preventDefault();
		var word = ($(".wordItem").text());
		Session.set('selectedWord',this.word);

		//one card open at a time
		$('.list-group').find('.gigante').each( function( i, itemElem ) {
			$(itemElem).toggleClass('gigante');
		});
		$('.definition-ondemand').remove();
		$('.close-button').remove();

		//click on the link and clicking on the link cell
		var target2 = e.target.getElementsByTagName('a')[0];
		var target1 = e.target;
		if(e.target.getElementsByTagName('a').length === 0){
			cardHandler(target1);
		}
		if(e.target.getElementsByTagName('a').length === 1){
			cardHandler(target2);
		}

	},
	'mousedown .close-button, click .close-button': function(e) {
		e.preventDefault;
		var message = 'Are you sure you want to remove "' + this.word + '"?';
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
