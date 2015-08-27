Meteor.methods({
	wordInsert: function(postAttributes) {
		var user = Meteor.user();
		var word = _.extend(postAttributes, {
			userId: user._id,
			definition: "definition from api call",
			createdAt: new Date()
		});
		var postId = Words.insert(word)
	}
})
