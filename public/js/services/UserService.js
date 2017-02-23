var app = angular.module('PETiano');

app
	.service('UserService',
		function($rootScope, $cookies, $resource, $state, Request) {
			var $scope = this;
			$scope.user = {};

			$scope.reset = function() {
				$scope.user = {};
				$cookies.remove('user');
			};

			$scope.isAuthenticated = function() {
				if($cookies.get('user')) {
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
				var obj = {tId: $cookies.get('user')};
				$scope.set(obj);
				Request
					.send('get', $resource('/api/petiano/login'))({})
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
