Router.configure({
	layoutTemplate: 'layout'
});

Router.route('/', {name:'userProfile'})

Router.route('/reader', {name:'reader'})

// Router.route('/submit', {name: ''});

// Router.route('/login', {name: ''});

Router.onBeforeAction('dataNotFound', {only: 'userProfile'});
