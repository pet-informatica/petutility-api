angular
	.module('Finance')
	.factory('PenaltyAPI', function($resource) {
		var API = $resource('/api/penalty/:penaltyId');

		return {
			getPenalties: (done) => {
				API.query(function(data) {
					return done && done(null, data);
				}, function(err) {
					return done && done(err);
				});
			},
			getAllPenalties: (done) => {
				API.query(function(data) {
					return done && done(null, data);
				}, function(err) {
					return done && done(err);
				});
			},
			createPenalty: (penalty, done) => {
				API.save(penalty, function(data) {
					return done && done(null, data);
				}, function(err) {
					return done && done(err);
				})
			},
			deletePenalty: (penalty, done) => {
				API.delete({penaltyId: penalty.Id}, function() {
					return done && done();
				}, function(err) {
					return done && done(err);
				})
			},
			updatePenalty: (penalty, done) => {
				API.update({penaltyId: penalty.Id}, penalty, function(data) {
					return done && done(null, data);
				}, function(err) {
					return done && done(err);
				});
			},
			changePenaltyStatus: (penalty, done) => {
				API.update({penaltyId: penalty.Id}, penalty, function(data) {
					return done && done(null, data);
				}, function(err) {
					return done && done(err);
				});
			}
		}
	});
