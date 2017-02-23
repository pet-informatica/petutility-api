angular
	.module('Login')
	.controller('LoginController', function($scope, UserAPI, CandidatoAPI, $http) {
		$scope.login = (user) => {
			UserAPI.login(user, (err1) => {
				if(err1) {
					CandidatoAPI.login(user, (err2) => {
						if(err2) {
							$scope.errMsg = err2.status + ' - ' + err2.data.message;
						} else {
							$scope.errMsg = null;
						}
					});
				}	else {
					$scope.errMsg = null;
				}
			});
		};

		$(document).ready(function() {
  			$('.modal-trigger').leanModal();
		});

		$scope.fpass = function(userLogin, userEmail){
			$http({
		   		method: 'HEAD',
		    	url: '/api/fpass/',
		    	params: {userLogin:userLogin, userEmail:userEmail}
		    }).then(function(result) {
		    	console.log(result);
		    	Materialize.toast('Um e-mail com sua senha está sendo enviado pra você!', 4000);
		    }, function(err){
		    	console.log(err);
		    	Materialize.toast('Login e/ou e-mail incorreto(s).', 4000);
		    });
		};

	});
