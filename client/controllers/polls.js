var app = angular.module('app');

app.controller('PollsController', ['$scope', '$http', function($scope, $http){
	$scope.title = 'Polls Page';
}]);