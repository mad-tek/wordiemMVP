Meteor.publish('words', function () {
	var currentUserId = this.userId;
		return Words.find({userId: currentUserId});
		// return Words.find({});
});