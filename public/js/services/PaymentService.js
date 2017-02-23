var app = angular.module('Finance');

app
	.service('PaymentService', ['$cookies', '$resource', 'Request',
		function($cookies, $resource, Request) {
			console.log("in function");
			console.log(Request);
			var $scope = this;

			$scope.set = function(payments) {
				$scope.payments = payments;
			};

			$scope.reset = function() {
				$scope.payments = {};
			}
		}
	]);
