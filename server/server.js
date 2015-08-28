Meteor.methods({
	wordInsert: function(postAttributes) {
		var user = Meteor.user();
		var word = _.extend(postAttributes, {
			userId: user._id,
			definition: "definition from api call",
			createdAt: new Date()
		});
		var postId = Words.insert(word)
		$('.list-group').packery();
	}
})

if (Meteor.isServer){
	Meteor.startup(function() {
		var cheerio = Meteor.npmRequire('cheerio');

		Meteor.methods({
			scrape: function(link) {
				var returnRes = [];
				result = Meteor.http.get(link);
				$ = cheerio.load(result.content);
				returnRes.push($('title').text().trim());
				returnRes.push($('body').text().trim());
				return returnRes;
			}
		})
	})
}
