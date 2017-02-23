angular
	.module('Finance')
	.factory('PigpetAPI', ['Request', 'UserService', '$resource', '$cookies',
			function(Request, UserService, $resource, $cookies) {
		var API = {
			getPigPetBalance: Request.send('get', $resource('/api/pigpet/getPigPetBalance')),
			updatePigPetBalance: Request.send('save', $resource('/api/pigpet/updatePigPetBalance'))
		};

		return {
      getPigPetBalance: (done) => {
				API.getPigPetBalance()
				.then(function(data) {
					return done && done(null, data);
				}, function(err) {
					return done && done(err);
				})
			},
			updatePigPetBalance: (pigpet, done) => {
				API.updatePigPetBalance(pigpet)
				.then(function(data) {
					return done && done(null, data);
				}, function(err) {
					return done && done(err);
				})
			}
		}
	}]);
