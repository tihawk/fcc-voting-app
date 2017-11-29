var app = angular.module('app');

app.controller('RegisterController', ['$scope', '$http', '$window', '$location',function($scope, $http, $window, $location){
	$scope.title = 'Please enter your desired username and password to register';
	$scope.error;

	$scope.register = function(){
		$http.post('/api/register', $scope.user)
			.then(response=>{
				//save token to local storage
				$window.localStorage.token = response.data;
				$scope.error = undefined;
				$window.location.reload();
				$window.location.href = "#/profile";
			}, error=>{
				if(error.data.errmsg.indexOf('E11000 duplicate key error index')!==-1){
					$scope.error = 'Username already taken';
				} else{
					$scope.error = error.data.errmsg.slice(0, error.data.errmsg.indexOf(':'));
				}
			});
	};
}]);