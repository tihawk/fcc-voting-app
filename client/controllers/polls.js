var app = angular.module('app');

app.controller('PollsController', ['$scope', '$http', function($scope, $http){
	$scope.title = 'Polls Page';
	$scope.error;

	$scope.getPolls = function(){
		$http.get('/api/polls')
			.then(response=>{
				$scope.error = null;
				$scope.polls = response.data;
			}, error=>{
				$scope.error = error.data;
			});
	};
}]);