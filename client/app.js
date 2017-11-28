var app = angular.module('app', ['ngRoute', 'angular-jwt']);

app.config(($routeProvider, $locationProvider)=>{
	$locationProvider.hashPrefix('');
	$routeProvider.when('/', {
		controller: 'MainController',
		templateUrl: 'views/main.html',
		access: {
			restricted: false
		}	
	})
	.when('/register', {
		controller: 'RegisterController',
		templateUrl: 'views/register.html',
		access: {
			restricted: false
		}	
	})
	.when('/login', {
		controller: 'LoginController',
		templateUrl: 'views/login.html',
		access: {
			restricted: false
		}	
	})
	.when('/profile', {
		controller: 'ProfileController',
		templateUrl: 'views/profile.html',
		access: {
			restricted: true
		}	
	})
	.when('/polls', {
		controller: 'PollsController',
		templateUrl: 'views/polls.html',
		access: {
			restricted: false
		}	
	})
	.when('/polls/:id', {
		controller: 'PollController',
		templateUrl: 'views/poll.html',
		access: {
			restricted: false
		}	
	})
	.when('/createpoll', {
		controller: 'ProfileController',
		templateUrl: 'views/profile.html',
		access: {
			restricted: true
		}	
	})
	.otherwise('/');
});