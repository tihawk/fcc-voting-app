var app = angular.module('app');

app.controller('PollsController', ['$scope', '$http', '$routeParams', '$window', function($scope, $http, $routeParams, $window){
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

	$scope.initCtx = function(){
		this.ctx = document.getElementById("myChart").getContext('2d');
		this.myChart;
	};

	$scope.getPoll = function(){
		var id = $routeParams.id;
		$http.get('/api/polls/' + id)
			.then(response=>{
				$scope.error = null;
				$scope.poll = response.data;
				//populate chart data and draw
				
				$scope.draw();

			}, error=>{
				$scope.error = error.data;
			});
	};

	$scope.voted = false;
	$scope.other = false;
	$scope.chosenOption = {
		name: '',
		votes: 0
	};
	$scope.otherOption = {
		name: '',
		votes: 1
	};

	$scope.voteOther = function(){
		if($window.localStorage.token){
			$scope.other = true;
			$scope.chosenOption.votes = 1;
		} else {
			$window.location.href = '#/login'
		}
	}

	$scope.vote = function(){
		$scope.other = false;
		$scope.voted = true;
		$http.put('/api/polls/vote/', {
			poll: $scope.poll,
			votedFor: $scope.chosenOption
		})
			.then(response=>{
				$scope.getPoll();
			}, error=>{
				$scope.error = error.data;
			});
	};


	$scope.draw = function(){
		$scope.labels = [];
		$scope.data = [];
		for(let i = 0; i < $scope.poll.options.length; i++){
			$scope.labels.push($scope.poll.options[i].name);
			$scope.data.push($scope.poll.options[i].votes);
		}
		
		this.myChart = new Chart(this.ctx, {
		    type: 'bar',
		    data: {
		        labels: $scope.labels,
		        datasets: [{
		            label: '# of Votes',
		            data: $scope.data,
		            backgroundColor: [
		                'rgba(255, 99, 132, 0.2)',
		                'rgba(54, 162, 235, 0.2)',
		                'rgba(255, 206, 86, 0.2)',
		                'rgba(75, 192, 192, 0.2)',
		                'rgba(153, 102, 255, 0.2)',
		                'rgba(255, 159, 64, 0.2)'
		            ],
		            borderColor: [
		                'rgba(255,99,132,1)',
		                'rgba(54, 162, 235, 1)',
		                'rgba(255, 206, 86, 1)',
		                'rgba(75, 192, 192, 1)',
		                'rgba(153, 102, 255, 1)',
		                'rgba(255, 159, 64, 1)'
		            ],
		            borderWidth: 1
		        }]
		    },
		    options: {
		        scales: {
		            yAxes: [{
		                ticks: {
		                    beginAtZero:true
		                }
		            }]
		        }
		    }
		});
	};


}]);