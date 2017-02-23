angular
	.module('SideNav')
	.controller('SideNavController', function($scope, UserAPI, CandidatoAPI) {
		$scope.logout = function() {
			UserAPI.logout();
			CandidatoAPI.logout();
		};
	});
