Template.wordCard.helpers({
	definition: function (){
		return Words.find({word: Session.get("selectedWord")});
	}	
});