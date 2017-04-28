angular
	.module('Finance')
	.factory('SpendingAPI',
		function(Request, UserService, $resource, $cookies) {
			var API = $resource('/api/spending/:spendingId', {}, {
				'update': {
					method: 'PUT'
				},
				'accept': {
					method: 'POST',
					url: 'api/spending/:spendingId/accept'
				}
			});

			return {
	      createSpending: (spending, done) => {
					API.save(spending, function(data) {
						return done && done(null, data);
					}, function(err) {
						return err;
					})
				},
				getSpendings: (done) => {
					API.query(function(data) {
						return done && done(null, data);
					}, function(err) {
						return done && done(err);
					})
				},
				deleteSpending: (spending, done) => {
					API.delete({spendingId:spending.Id}, function() {
						return done && done();
					}, function(err) {
						return done && done(err);
					})
				},
				updateSpending: (spending, done) => {
					API.update({spendingId: spending.Id}, spending, function(data) {
						return done && done(null, data);
					}, function(err) {
						return done && done(err);
					})
				},
				acceptSpending: (spending, done) => {
					API.accept({spendingId: spending.Id}, spending, function(data) {
						return done && done(null, data);
					}, function(err) {
						return done && done(err);
					})
				}
			}
	}
);
