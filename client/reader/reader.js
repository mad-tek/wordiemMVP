/////////////////////local helpers//////////////////

//create new element helper
function WDcreateElement(tagName, className, fn) {
  var element = document.createElement(tagName);
  element.className = className;
  fn(element);
}

//Highlight vocab
function WDhighlighter(text, highlighter) {
	var wordiemBody = document.getElementById('readerPanel');
	var query = new RegExp("(\\b" + text + "\\b)", "gim");
	//define highlight function
	function findAndHighlight(node) {
		var next;
		if (node.nodeType === 1) {
				// (Element node)
				if (!!(node = node.firstChild)) {
						do {
								// Recursively call findAndHighlight on each child node
								next = node.nextSibling;

								findAndHighlight(node);
						} while(!!(node = next));
				}
		} else if (node.nodeType === 3) {
			// (Text node)
			if (query.test(node.data)) {
				//matching query

        if(!highlighter){
          //console.log('unhighlight this node!');
          unhighlightNode(node, text);
        }

        //check if highlighted already
				if ($(node).parent().hasClass('wordiem-highlight')){
					//check if already highlighted. if already highlighted return false
					return false;
				}else{
					//apply highlight class unobstructively
          if(highlighter === "highlight"){
  					highlightNode(node);
  					//console.log('FOUND A MATCH!');
          }
				}

			}
		}
	}
  //highlight
	function highlightNode(textNode) {
		//place holder div
		var temp = document.createElement('div');
		//span highlight class to be added to matching query
		temp.innerHTML = textNode.data.replace(query, '<span class="wordiem-highlight">$1</span>');
		// Extract produced nodes and insert them before original textNode:
		while (temp.firstChild) {
				textNode.parentNode.insertBefore(temp.firstChild, textNode);
		}
		// Remove original text-node
		textNode.parentNode.removeChild(textNode);
	}
  //unhighlight
  function unhighlightNode(textNode, text) {
    //target the enclosing span with highlight class
    var originHighlight = textNode.parentNode;
    //place holder div
    var temp = document.createElement('div');
    //replace span with normal text
    temp.innerHTML = text;
    // Extract produced nodes and insert them before original textNode:
    while (temp.firstChild) {
				originHighlight.parentNode.insertBefore(temp.firstChild, originHighlight);
		}
    // Remove original text-node
    originHighlight.parentNode.removeChild(originHighlight);
	}

	//run highlight function on body
	findAndHighlight(wordiemBody);
}

//popup definition handler
//dependencies: jquery, "src/inject/helpers.js"
function WDpopDefinition() {
  //create popup definition div
  WDcreateElement('div', 'definition-container', function(popup) {
    document.getElementsByTagName('body')[0].appendChild(popup);
  });

  function popupHandler() {
    //currently clicked word
    var clickedWord = this.innerHTML.toLowerCase();
    var definitionContainer = $('.definition-container')[0];
    console.log(clickedWord);
    var defQuery = Words.find({word: clickedWord}, { word: 1, definition: 1, _id: 0});
    var defContent = defQuery.map(function(query) {
      return query.word + ": " + query.definition;
    })
    //popup location and properties
    var x = event.clientX;
    var y = event.clientY+window.pageYOffset+10;
    definitionContainer.style.display = 'block';
    definitionContainer.style.left = x+'px';
    definitionContainer.style.top = y+'px';
    definitionContainer.innerHTML = defContent;
    //close definition popup
    definitionContainer.addEventListener('click', function(){
      definitionContainer.style.display = 'none';
    });

    //create remove clickedWord button
    WDcreateElement('button', 'removeWordBtn', function(removeWordBtn) {
      removeWordBtn.innerHTML = 'Remove: "' + clickedWord + '"';
      document.getElementsByClassName('definition-container')[0].appendChild(removeWordBtn);
      //when clicked sends clickedWord to background.js to be removed
      removeWordBtn.addEventListener('click', function() {
        port.postMessage({
        	removeWord: clickedWord
        });
        //remove highlight class from deleted clickedWord
        WDhighlighter(clickedWord, false);
      });
    });
    //create pin clickedWord button
    WDcreateElement('button', 'removeWordBtn', function(removeWordBtn) {
      removeWordBtn.innerHTML = 'Pin: "' + clickedWord + '"';
      document.getElementsByClassName('definition-container')[0].appendChild(removeWordBtn);
      //when clicked sends clickedWord to background.js to be pinned
      removeWordBtn.addEventListener('click', function() {
        port.postMessage({
        	pinWord: clickedWord
        });
        //add special highlight class for pinned clickedWord
        //.....to be worked on
      });
    });
  }
  //number of highlighted words
  console.log($('.wordiem-highlight').length);

  //add onclick listener for pop up definition for each highlighted words
  var highlightClass = $('.wordiem-highlight');
  for(var i=0; i<highlightClass.length; i++){
        highlightClass[i].addEventListener('click', popupHandler, false);
  }
}

////////////////////meteor///////////////////////////////
Template.reader.onRendered(function() {
  var words = Words.find({}, {sort: {createdAt: -1}, word: 1, definition: 0, _id: 0});
  var vocab = words.map(function(query) {
    return query.word;
  });
  //highlighter reset
  var highlightReset = document.getElementsByClassName('wordiem-highlight');
  for (var i = 0; i < highlightReset.length; i++){
    var text = highlightReset[i].innerHTML;
    WDhighlighter(text, false);
  }

  console.log(vocab);
  //vocab is the array. for each value in the array, find and highlight in the DOM
  vocab.forEach(function(text){
    //highlighter from helper.js
    WDhighlighter(text, "highlight");
  });
  //attach eventlistener for popup definition. call from "src/inject/popDefinition.js"
  WDpopDefinition();
});

Template.reader.helpers({
  scrape: function() {
    return Session.get("scrape")[1];
  },
  title: function() {
    return Session.get("scrape")[0];
  }
})

Template.reader.events({
  'submit .submitReaderForm': function(e) {
    e.preventDefault();
    var source = e.target.readerSource.value;
    Meteor.call('scrape', source, function(error, result) {
      if(error){
        console.log("error", error);
      };
      Session.set("scrape", result)
    })
  },
  'click #yellow' : function(e) {
    e.preventDefault();
    $('.wordiem-highlight').css('background-color', 'yellow');
    $('.wordiem-highlight').css('color', 'black');
  },
  'click #blue' : function(e) {
    e.preventDefault();
    $('.wordiem-highlight').css('background-color', 'blue');
    $('.wordiem-highlight').css('color', 'white');
  },
  'click #red' : function(e) {
    e.preventDefault();
    $('.wordiem-highlight').css('background-color', 'red');
    $('.wordiem-highlight').css('color', 'white');
  },
  'click #green' : function(e) {
    e.preventDefault();
    $('.wordiem-highlight').css('background-color', 'green');
    $('.wordiem-highlight').css('color', 'white');
  }
})
