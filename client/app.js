var app = angular.module('app', ['ngRoute', 'angular-jwt']);

app.run(($rootScope, $location, $window, $http)=>{
	$rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute){
		if(nextRoute.access !== undefined && nextRoute.access.restricted === true && !$window.localStorage.token){
			event.preventDefault();
			$location.path('/login');
		}
		else if(nextRoute.access !== undefined && nextRoute.access.restricted === true && $window.localStorage.token){
			var token = {token: $window.localStorage.token};
			$http.post('/api/verify_token', token)
				.then(response=>{}, error=>{
					delete $window.localStorage.token;
					$location.path('/login')
				});
		}
	});
});

app.config(($routeProvider, $locationProvider)=>{
	$locationProvider.hashPrefix('');
	$routeProvider.when('/', {
		controller: 'PollsController',
		templateUrl: 'views/polls.html',
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