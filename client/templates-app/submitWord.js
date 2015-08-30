Template.submitWord.events({
	'submit .submitWordForm': function (e) {
		e.preventDefault();
		var word = {word:e.target.submitWord.value};
		console.log(word);

		Meteor.call('wordInsert', word);

		e.target.submitWord.value = '';
	}
});
