var app = angular.module('app');

app.controller('LoginController', ['$scope', '$http', '$window', '$location', function($scope, $http, $window, $location){
	$scope.title = 'Log in with your username and password';
	$scope.error;

	$scope.login = function(){
		$http.post('/api/login', $scope.user)
			.then(response=>{
				//save token to local storage
				$window.localStorage.token = response.data;
				$scope.error = undefined;
				$location.path('/profile');
			}, error=>{
				$scope.error = error.data;
			});
	};
}]);