var app = angular.module('app');

app.controller('ProfileController', ['$scope', '$http', '$window','jwtHelper', function($scope, $http, $window, jwtHelper){	
	var token = $window.localStorage.token;
	$scope.name = jwtHelper.decodeToken(token).data.name;
	$scope.title = $scope.name + '\'s profile page';

	$scope.logout = function(){
		delete window.localStorage.token;
		$window.location.href = '#/login';
	}

}]);