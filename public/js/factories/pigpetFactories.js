angular
	.module('Finance')
	.factory('PigpetAPI', function(Request, UserService, $resource, $cookies) {
		var API = $resource('/api/pigpet/:pigPetId');

		return {
      getPigPetBalance: (done) => {
				API.get({}, function(data) {
					return done && done(null, data);
				}, function(err) {
					return done && done(err);
				});
			},
			updatePigPetBalance: (parameters, done) => {
				API.update({}, parameters, function(data) {
					return done && done(null, data);
				}, function(err) {
					return done && done(err);
				});
			}
		}
	}
);
