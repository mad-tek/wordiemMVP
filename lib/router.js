var requireLogin = function() {
	if (! Meteor.user()){
		this.render('landing');
	}else{
		this.next();
	}
}

Router.configure({
	layoutTemplate: 'layout'
});

Router.map(function() {
	this.route('landing', {
		path: '/hello'
	});
	this.route('userProfile', {
		path: '/'
	})
	this.route('reader', {
		path: 'reader'
	})
})

// Router.route('/', {name:'userProfile'})

// Router.route('/reader', {name:'reader'})

// Router.route('/submit', {name: ''});

// Router.route('/login', {name: ''});

// Router.onBeforeAction('dataNotFound', {only: 'userProfile'});

Router.onBeforeAction(requireLogin, {except: ['landing']});
