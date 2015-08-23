Wordboards = new Meteor.Collection('wordBoard');

Meteor.methods({
	wordBoardInsert: function(postAttributes) {
		var user = Meteor.user();
		
		//make api calls 
		var wordBoard = _.extend(postAttributes, {
			userId: user._id,
			author: user.username,
			submitted: new Date(),
			
		});

		var postId = Wordboards.insert(wordBoard)
	}
})