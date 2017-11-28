var app = angular.module('app');

app.controller('PollController', ['$scope', '$http', function($scope, $http){
	$scope.title = 'Poll Page';
}]);