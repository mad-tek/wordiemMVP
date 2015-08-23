Template.wordBank.helpers({
	words: function() {
		return Words.find();
	}
});

Template.wordBank.events({
	'click .wordItem': function (e) {
		e.preventDefault();
	var word = ($(".wordItem").text());

	console.log(word)
	}

});