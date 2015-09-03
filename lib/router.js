var requireLogin = function() {
	if (! Meteor.user()){
		this.render('landing');
		$('body').addClass('landingBg');
	}else{
		$('body').removeClass('landingBg');
		this.next();
	}
}

Router.configure({
	layoutTemplate: 'layout'
});

Router.map(function() {
	this.route('landing', {
		path: '/hello',
		load: function() {
			$('body').addClass('landingBg');
		}
	});
	this.route('userProfile', {
		path: '/',
		unload: function() {
			$('body').removeClass('landingBg');
		}
	})
	this.route('reader', {
		path: 'reader',
		unload: function() {
			$('body').removeClass('landingBg');
		}
	})
})

// Router.route('/', {name:'userProfile'})

// Router.route('/reader', {name:'reader'})

// Router.route('/submit', {name: ''});

// Router.route('/login', {name: ''});

// Router.onBeforeAction('dataNotFound', {only: 'userProfile'});

Router.onBeforeAction(requireLogin, {except: ['landing']});
