angular
	.module('Finance')
	.factory('PenaltyAPI', function(Request, UserService, $resource, $cookies) {
		var API = {
			getPenalties: Request.send('query', $resource('/api/penalty/getPenalties')),
			getAllPenalties: Request.send('query', $resource('/api/penalty/getAllPenalties')),
			createPenalty: Request.send('save', $resource('/api/penalty/createPenalty')),
			deletePenalty: Request.send('remove', $resource('/api/penalty/deletePenalty')),
			updatePenalty: Request.send('save', $resource('/api/penalty/updatePenalty')),
			changePenaltyStatus: Request.send('save', $resource('/api/penalty/changePenaltyStatus'))
		};

		return {
			getPenalties: (done) => {
				API
					.getPenalties()
					.then(function(data) {
						return done && done(null, data);
					}, function(err) {
						return done && done(err);
					})
			},
			getAllPenalties: (done) => {
				API
					.getAllPenalties()
					.then(function(data) {
						return done && done(null, data);
					}, function(err) {
						return done && done(err);
					})
			},
			createPenalty: (penalty, done) => {
				API.createPenalty(penalty)
				.then(function(data) {
					return done && done(null, data);
				}, function(err) {
					return err;
				})
			},
			deletePenalty: (penalty, done) => {
				API.deletePenalty(penalty)
				.then(function() {
					return done && done();
				}, function(err) {
					return done && done(err);
				})
			},
			updatePenalty: (penalty, done) => {
				API.updatePenalty(penalty)
				.then(function(data) {
					return done && done(null, data);
				}, function(err) {
					return done && done(err);
				})
			},
			changePenaltyStatus: (penalty, done) => {
				API.changePenaltyStatus(penalty)
				.then(function(data) {
					return done && done(null, data);
				}, function(err) {
					return done && done(err);
				})
			}
		}
	});
