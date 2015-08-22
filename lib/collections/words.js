Words = new Meteor.Collection('word');

Meteor.methods({
	wordInsert: function(postAttributes) {
		var user = Meteor.user();
		
		var word = _.extend(postAttributes, {
			userId: user._id,
			author: user.username,
			submitted: new Date(),
			
		});

		var postId = Words.insert(word)
	}
})