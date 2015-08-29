var results = [];
var tempDef = [];
var tempPos = [];


Meteor.methods({
	wordInsert: function(postAttributes,callback) {
		results = [];
		tempDef = [];
		tempPos = [];
		
		var base_url = 'http://www.dictionaryapi.com/api/v1/references/collegiate/xml/'+postAttributes.word+'?key=a9b252b9-b995-41e8-9e32-a2abbd18c801';
		Meteor.http.get(base_url, function (error, response){
			if (response.statusCode == 200) {
				console.log(response.content)
				xml2js.parseString(response.content, function (error, result){
					var entries = result.entry_list.entry				
					for (var i=0; i<entries.length; i++) {
						
						//only show entries that are actually your word
						if (entries[i].ew == postAttributes.word) {

							var definition = entries[i].def[0].dt;						
            	var partOfSpeech = entries[i].fl;
            	
            	switch (typeof definition) {
								case "object":
		              for (var i=0; i<(_.size(definition)); i++){
		                var definitionStr = "";
		                if (_.size(definition[i]["_"]) > 1) definitionStr += " "+definition[i]["_"];
		              }
		              // console.log(definitionStr + "****************************")
	              // definition = definitionStr;
	              break;
	          	case "string":
	          	default:
	              break;
      				}		
            	results.push({
            		partOfSpeech: partOfSpeech,
            		definition: definition
            	});
            }
          }
				});				

     	_.each(results, function(item) {
          tempDef.push(item.definition)
          tempPos.push(item.partOfSpeech)
				});

		      var user = Meteor.user();
		      var word = _.extend(postAttributes, {
		      		userId: user._id,
		      		definition: tempDef,
		      		partOfSpeech: tempPos,
		      		createdAt: new Date()
		      	});
		      	
		      var postId = Words.insert(word);
		      	// $('.list-group').packery(); 
      	console.log(results)
			} else {
				console.log("Response issue: ", result.statusCode);
			};

		});
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
