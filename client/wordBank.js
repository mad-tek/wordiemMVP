//dragging init
var draggability = function() {
	$('.list-group').find('.list-group-item').each( function( i, itemElem ) {
		// make element draggable with Draggabilly
		var draggie = new Draggabilly( itemElem );
		// bind Draggabilly events to Packery
		$('.list-group').packery( 'bindDraggabillyEvents', draggie );
	});
}
//word card handler
var cardHandler = function(wordcard) {
	//open current word card
	$(wordcard).parent().toggleClass('gigante');
	$('.list-group').packery();

	//dynamic create DOM in word card
	var createElement = function(el, txt, clas) {
		var newdiv = document.createElement(el);
		var content = document.createTextNode(txt);
		newdiv.className = clas;
		newdiv.appendChild(content);
		wordcard.parentNode.appendChild(newdiv);
	}

	//populates word card
	var word = Words.find({word: Session.get("selectedWord")}, {definition: 1, word: 1, _id:0});

	//definition
	var defText = word.map(function(query) {return query.word + ": " + query.definition;});
	createElement("p", defText, "definition-ondemand");

	//delete word button
	createElement("a", "delete this word |", "delete-button");

	//close button
	createElement("a", "| close", "close-button");
}

Template.wordBank.helpers({
	words: function() {
		var words = Words.find({}, {sort: {createdAt: -1}, word: 1, definition: 0, _id: 0});
		return words;
	},
	definition: function (){
		$('.list-group').packery();
		return Words.find({word: Session.get("selectedWord")});
	}
});


Template.wordBank.onRendered(function() {
	this.find('.list-group')._uihooks = {
		insertElement: function(node, next) {
			$('.list-group').packery({
				itemSelector: '.list-group-item',
				gutter: 5
			});
			$('.list-group').prepend(node);
			$('.list-group').packery('prepended', node);
			draggability();
		}
	}
});

Meteor.startup(function() {
	Tracker.autorun(function() {
		console.log('There are ' + Words.find().count() + ' words');
	})
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
		$('.delete-button').remove();
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
	'mousedown .delete-button, click .delete-button': function(e) {
		e.preventDefault;
		var message = 'Are you sure you want to remove "' + this.word + '"?';
		if(confirm(message)){
			Words.remove(this._id);
			return true;
		}else{
			return false;
		}
	},
});
