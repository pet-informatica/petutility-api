angular
	.module('PETiano')
	.factory('UserAPI', function(UserService, Request, $state, $resource, $cookies, $rootScope) {
		var API = {
			login: Request.send('get', $resource('/api/petiano/login')),
			update: Request.send('save', $resource('/api/petiano/update'))
		};

		return {
			login: (user, done) => {
				UserService.reset();

				API
					.login(user)
					.then(function(data) {
						UserService.set(data);
						$rootScope.user = UserService.user;
						$state.go('logged.calendar');
						return done && done(null);
					}, function(err) {
						return done && done(err);
					});
			},

			logout: () => {
				UserService.reset();

				$cookies.remove('user');

				$state.go('login');
			},

			update: (user, done) => {
				API
					.update(user)
					.then(function(data) {
						UserService.set(data);
						$rootScope.user = UserService.user;
						return done && done(null);
					}, function(err) {
						return done && done(err);
					});
			}
		}
	});
