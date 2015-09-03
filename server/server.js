var results = [];
var tempDef = [];
var tempPos = [];
var tempPro = [];

Meteor.methods({
	wordInsert: function(postAttributes,callback) {
		results = [];
		tempDef = [];
		tempPos = [];
		tempPro = [];
		
		

		// if (Words.findOne({word: postAttributes.word, postId: Meteor.userId()})) {
		// 	console.log("You already have that word in your word bank!")
		// } else { 
			var base_url = 'http://www.dictionaryapi.com/api/v1/references/collegiate/xml/'+postAttributes.word+'?key=a9b252b9-b995-41e8-9e32-a2abbd18c801';
			Meteor.http.get(base_url, function (error, response){
				if (response.statusCode == 200) {
					xml2js.parseString(response.content, function (error, result){
						var entries = result.entry_list.entry
						
						//sort through the entire entry result
						for (var i=0; i<entries.length; i++) {
							//only show entries that are actually your word
							if (entries[i].ew == postAttributes.word) {
								var definition = entries[i].def[0].dt
								var partOfSpeech = entries[i].fl;
	            	var pronounciation = entries[i].pr

								for (var j =0; j<definition.length; j++){
									var definitionStr = "";
									if (typeof definition[j] === 'object') {
										definitionStr += " "+definition[j]["_"];
									}
									var cookie = definitionStr
									if (typeof definition[j] === "string"){
										cookie += " "+ definition[j]
									}	
								results.push({
	            		partOfSpeech: partOfSpeech,
	            		definition: cookie
	            	});	            	
								}
	          	}
	         	}
	        })

	     	_.each(results, function(item) {
	          tempDef.push(item.definition)
	          tempPos.push(item.partOfSpeech)
	          tempPro.push(item.pronounciation)
					});

			      var user = Meteor.user();
			      var word = _.extend(postAttributes, {
			      		userId: user._id,
			      		definition: tempDef,
			      		partOfSpeech: tempPos,
			      		pronounciation: tempPro,
			      		createdAt: new Date()
			      	});

			      var postId = Words.insert(word);
				} else {
					console.log("Response issue: ", response.statusCode);
				};
		});
	}
	// }
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
			},
			newSignUp: function(emailadd) {
				var date = new Date()
				var time = new Date()
				timestamp = date.toLocaleDateString() + " " + time.toLocaleTimeString();
		    Signup.insert({
					email: emailadd,
					createdAt: timestamp
				});
				return true;
		  }
		})
	})
}
