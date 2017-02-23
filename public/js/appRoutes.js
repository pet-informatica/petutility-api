var app = angular.module('appRoutes');

app
	.config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/calendar');

		$stateProvider
			.state('login', {
				url: '/login',
				templateUrl: 'public/templates/login.html',
				controller: 'LoginController',
				data: {
					displayNav: false,
					authenticate: false
				}
			})
			.state('logged', {
				url: '',
				template: '<ui-view/>',
				abstract: 'true',
				data: {
					authenticate: true,
					displayNav: false
				},
				resolve: {
					invoke: function() {
					    window.setTimeout(() => {
					      $('.button-collapse').sideNav({
					        menuWidth: 300,
					        closeOnClick: window.innerWidth <= 992
					      });
					    }, 0);
					}
				}
			})
			.state('logged.recordOfMeeting',{
				url: '/recordOfMeeting',
				templateUrl: 'public/templates/recordOfMeeting.html',
				controller: 'RecordOfMeetingController',
				data: {
					tabName: 'recordOfMeeting',
					tabDisplayName: 'Reunião',
					displayNav: true,
					authenticate: true
				}
			})
			.state('logged.calendar', {
				url:'/calendar',
				templateUrl: 'public/templates/calendar.html',
				controller: 'CalendarController',
				data: {
					tabName: 'calendar',
					tabDisplayName: 'Calendário',
					displayNav: true,
					authenticate: true
				}
			})
			.state('logged.finance', {
				url:'/finance',
				templateUrl: 'public/templates/finance.html',
				controller: 'financeController',
				data: {
					tabName: 'finance',
					tabDisplayName: 'Financeiro',
					displayNav: true,
					authenticate: true
				}
			})
			.state('logged.profile', {
				url:'/profile',
				templateUrl: 'public/templates/profile.html',
				controller: 'ProfileController',
				data: {
					displayNav: false,
					authenticate: true
				}
			})
			.state('logged.ideas', {
				url: '/ideas',
				templateUrl: 'public/templates/ideas.html',
				controller: 'IdeasController',
				data: {
					tabName: 'ideas',
					tabDisplayName: 'Ideias',
					displayNav: true,
					authenticate: true
				}
			})
			.state('logged.selecao', {
				url: '',
				template: '<ui-view/>',
				data: {
					displayNav: false,
					authenticate: true
				}
			})
			.state('logged.selecao.list', {
				url: '/selecao',
				templateUrl: 'public/templates/selecaoDisplay.html',
				controller: 'SelecaoDisplayController',
				data: {
					tabName: 'selecaoDisplay',
					tabDisplayName: 'Seleção',
					displayNav: true,
					authenticate: true
				}
			})
			.state('logged.selecao.detail', {
				url: '/selecao/{selecaoId:int}',
				templateUrl: 'public/templates/selecaoDetail.html',
				controller: 'SelecaoDetailController',
				data: {
					displayNav: false,
					authenticate: true
				}
			})
			.state('logged.selecao.etapa', {
				  url: '/selecao/{selecaoId:int}/etapa/{etapaId:int}',
				  templateUrl: 'public/templates/etapa.html',
				  controller: 'EtapaController',
				  data: {
				    displayNav: false,
				    authenticate: true
				  }
				})
				.state('signup', {
				url:'/signup',
				templateUrl: 'public/templates/signup.html',
				controller: 'SignupController',
				data: {
					authenticate: false
				}
			})
			.state('candidato', {
				url:'/candidato',
				template: '<ui-view/>',
				abstract: 'true',
				data: {
					authenticate: true,
					displayNav: false
				},
				resolve: {
					invoke: function() {
					    window.setTimeout(() => {
					      $('.button-collapse').sideNav({
					        menuWidth: 300,
					        closeOnClick: window.innerWidth <= 992
					      });
					    }, 0);
					}
				}
			})
			.state('candidato.index', {
				url:'',
				templateUrl: 'public/templates/candidato/index.html',
				controller: 'CandidatoController',
				data: {
					tabName: 'index',
					tabDisplayName: 'Status',
					displayNav: true,
					authenticate: true
				}
			})
			.state('candidato.selecao', {
				url:'/selecao',
				templateUrl: 'public/templates/candidato/selecao.html',
				controller: 'CandidatoController',
				data: {
					tabName: 'selecao',
					tabDisplayName: 'Selecao',
					displayNav: true,
					authenticate: true
				}
			});
	});
