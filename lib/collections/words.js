Words = new Meteor.Collection('words');

if (Meteor.isClient){
	Meteor.subscribe('words')
}