var app = angular.module('Candidato');

app
	.service('CandidatoService',
		function($rootScope, $cookies, $resource, $state, Request) {
			var $scope = this;
			$scope.user = {};

			$scope.reset = function() {
				$scope.user = {};
				$cookies.remove('candidato');
			};

			$scope.isAuthenticated = function() {
				if($cookies.get('candidato')) {
					return true;
				} else {
					return false;
				}
			};

			$scope.isValidated = function() {
				return !!$scope.user.Id;
			};

			$scope.set = function(user) {
				$scope.user = user;
			};

			try {
				var obj = {tId: $cookies.get('candidato')};
				$scope.set(obj);
				Request
					.send('get', $resource('/api/candidato/login'))({})
					.then(function(data) {
						$scope.set(data);
						$rootScope.user = data;
					}, function() {
						$scope.reset();
					});
			} catch (err) {
				$scope.reset();
			}
		}
	);
