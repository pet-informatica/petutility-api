angular
	.module('Finance')
	.factory('PocketAPI', function($resource) {
		var API = $resource('/api/pocket/:pocketId');

		return {
			getPockets: (done) => {
				API.query(function(data) {
					return done && done(null, data);
				}, function(err) {
					return done && done(err);
				});
			},
			createPocket: (pocket, done) => {
				API.save(pocket, function(data) {
					return done && done(null, data);
				}, function(err) {
					return done && done(err);
				});
			},
			deletePocket: (pocket, done) => {
				API.delete({pocketId: pocket.Id}, function() {
					return done && done();
				}, function(err) {
					return done && done(err);
				});
			},
			updatePocket: (pocket, done) => {
				API.update({pocketId: pocket.Id}, pocket, function(data) {
					return done && done(null, data);
				}, function(err) {
					return done && done(err);
				});
			}
		}
	}
);
