var app = angular.module('app');

app.controller('MainController', ['$scope', '$http', function($scope, $http){
	$scope.title = 'Main Page';
}]);