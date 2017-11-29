var app = angular.module('app');

app.controller('ProfileController', ['$scope', '$http', '$window','jwtHelper', function($scope, $http, $window, jwtHelper){	
	var token = $window.localStorage.token;

	$scope.isEditing = false;

	$scope.profile = {
		title: jwtHelper.decodeToken(token).data.name + '\'s profile page',
		welcome: 'Welcome back, ' + jwtHelper.decodeToken(token).data.name + '!',
		descr: 'Here you can see the polls created by you, edit them, delete them as well as create a new poll.'
	};

	$scope.create = {
		title: 'Create a new poll',
		descr: 'Enter a name for the poll, as well as some options for people to vote for, and hit "Create Poll".',
		error: ''
	};

	$scope.myPolls = {
		title: 'Your polls',
		descr: 'Here you can view, edit and delete the polls submitted by you.',
	}

	$scope.edit = {
		title: 'Edit your poll',
		descr: 'You can add more options, and hit "Update Poll" to submit the changes.',
		error: null
	}

	$scope.emptyPoll = function(){
		$scope.newPoll = {
			name: '',

			options: [{
			name: '',
			votes: 0
			}],

			owner: jwtHelper.decodeToken(token).data._id
		};		
	};

	$scope.addOption = function(){
		if(this.newPoll.options[this.newPoll.options.length-1].name!==''){
			this.newPoll.options.push({
				name: '',
				votes: 0
			})
		}
	};

	$scope.removeOption = function(){
		if(this.newPoll.options.length >= 2){
			this.newPoll.options.pop();		
		}	
	};

	$scope.logout = function(){
		delete window.localStorage.token;
		$window.location.href = '#/login';
	};

	$scope.createPoll = function(){
		$http.post('/api/polls', $scope.newPoll)
			.then(response=>{
				$scope.create.error = null;
				console.log(response.data);
				$scope.emptyPoll();
				$scope.getPolls();
			}, error=>{

			});
	};

	$scope.getPolls = function(){
		$http.get('/api/polls/user/' + jwtHelper.decodeToken(token).data._id)
			.then(response=>{
				$scope.edit.error = null;
				$scope.polls = response.data;
			}, error=>{
				$scope.edit.error = error.data;
			});
	};

	$scope.deletePoll = function(id){
		$http.delete('/api/polls/' + id)
			.then(response=>{
				$scope.edit.error = null;
				$scope.getPolls();
			}, error=>{
				$scope.edit.error = error.data;
			});
	};

	$scope.editPoll = function(poll){
		$scope.newPoll = poll;
		$scope.isEditing = true;
		$scope.newOptions = [{
			name: '',
			votes: 0
		}];
	};

	$scope.addOptionEdit = function(){
		if(this.newOptions[this.newOptions.length-1].name!==''){
			this.newOptions.push({
				name: '',
				votes: 0
			})
		}
	}

	$scope.cancelEdit = function(){
		$scope.isEditing = false;
		$scope.emptyPoll();
	}

	$scope.updatePoll = function(){
		$scope.newPoll.options = $scope.newPoll.options.concat($scope.newOptions);
		$http.put('/api/polls/' + $scope.newPoll._id, $scope.newPoll)
			.then(response=>{
				$scope.isEditing = false;
				$scope.emptyPoll();
			}, error=>{
				if(error.data.errmsg.indexOf('E11000')!==-1){
					$scope.edit.error = 'A poll by this name already exists. Please use a different name!';
				} else if(error.edit.errmsg.indexOf('is required')!==-1){
					$scope.edit.error = 'All the fields should be filled. Why did you submit an empty poll anyway?';
				} else {
					$scope.edit.error = error.data.errmsg;
				}
			});
	}
}]);