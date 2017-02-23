angular
	.module('Finance')
	.factory('SpendingAPI', ['Request', 'UserService', '$resource', '$cookies',
			function(Request, UserService, $resource, $cookies) {
		var API = {
			getSpendings: Request.send('query', $resource('/api/spending/getSpendings')),
			createSpending: Request.send('save', $resource('/api/spending/createSpending')),
			deleteSpending: Request.send('delete', $resource('/api/spending/deleteSpending')),
			updateSpending: Request.send('save', $resource('/api/spending/updateSpending')),
			acceptSpending: Request.send('save', $resource('/api/spending/acceptSpending'))
		};

		return {
      createSpending: (spending, done) => {
				API.createSpending(spending)
				.then(function(data) {
					return done && done(null, data);
				}, function(err) {
					return err;
				})
			},
			getSpendings: (done) => {
				API.getSpendings()
				.then(function(data) {
					return done && done(null, data);
				}, function(err) {
					return done && done(err);
				})
			},
			deleteSpending: (spending, done) => {
				API.deleteSpending(spending)
				.then(function() {
					return done && done();
				}, function(err) {
					return done && done(err);
				})
			},
			updateSpending: (spending, done) => {
				API.updateSpending(spending)
				.then(function(data) {
					return done && done(null, data);
				}, function(err) {
					return done && done(err);
				})
			},
			acceptSpending: (spending, done) => {
				API.acceptSpending(spending)
				.then(function(data) {
					return done && done(null, data);
				}, function(err) {
					return done && done(err);
				})
			}
		}
	}]);
