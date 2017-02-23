angular
	.module('Candidato')
	.factory('CandidatoAPI', function(CandidatoService, Request, $state, $resource, $cookies, $rootScope) {
		var API = {
			login: Request.send('get', $resource('/api/candidato/login')),
			update: Request.send('save', $resource('/api/candidato/update'))
		};

		return {
			login: (user, done) => {
				CandidatoService.reset();

				API
					.login(user)
					.then(function(data) {
						CandidatoService.set(data);
						$rootScope.user = CandidatoService.user;
						$state.go('candidato.index');
						return done && done(null);
					}, function(err) {
						return done && done(err);
					});
			},

			logout: () => {
				CandidatoService.reset();

				$cookies.remove('candidato');

				$state.go('login');
			},

			update: (user, done) => {
				API
					.update(user)
					.then(function(data) {
						CandidatoService.set(data);
						$rootScope.user = CandidatoService.user;
						return done && done(null);
					}, function(err) {
						return done && done(err);
					});
			},

			loginNewUser: (user, done) => {
				CandidatoService.set(user);
				$rootScope.user = CandidatoService.user;
				$state.go('candidato');
				return done && done(null);
			}

		}
	});
