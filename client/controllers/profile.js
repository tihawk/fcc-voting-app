var app = angular.module('app');

app.controller('ProfileController', ['$scope', '$http', function($scope, $http){
	$scope.title = 'Profile Page';
}]);