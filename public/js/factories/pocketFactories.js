angular
	.module('Finance')
	.factory('PocketAPI', ['Request', 'UserService', '$resource', '$cookies',
			function(Request, UserService, $resource, $cookies) {
		var API = {
			getPockets: Request.send('query', $resource('/api/pocket/getPockets')),
			createPocket: Request.send('save', $resource('/api/pocket/createPocket')),
			deletePocket: Request.send('delete', $resource('api/pocket/deletePocket')),
			updatePocket: Request.send('save', $resource('/api/pocket/updatePocket'))
		};

		return {
			getPockets: (done) => {
				API
					.getPockets()
					.then(function(data) {
						return done && done(null, data);
					}, function(err) {
						return done && done(err);
					})
			},
			createPocket: (pocket, done) => {
				API.createPocket(pocket)
				.then(function(data) {
					return done && done(null, data);
				}, function(err) {
					return done && done(err);
				})
			},
			deletePocket: (pocket, done) => {
				API.deletePocket(pocket)
				.then(function() {
					return done && done();
				}, function(err) {
					return done && done(err);
				})
			},
			updatePocket: (pocket, done) => {
				API.updatePocket(pocket)
				.then(function(data) {
					return done && done(null, data);
				}, function(err) {
					return done && done(err);
				})
			}
		}
	}]);
