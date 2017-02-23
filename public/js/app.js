angular.module('appRoutes', []);
angular.module('Login', []);
angular.module('Candidato', []);
angular.module('Selecao', []);
angular.module('Etapa', []);
angular.module('PETiano', []);
angular.module('Util', []);
angular.module('SideNav', []);
angular.module('RecordOfMeeting', []);
angular.module('Selecao', []);
angular.module('Calendar', []);
angular.module('Finance', []);
angular.module('templates', []);
angular.module('AgendaPoint', []);
angular.module('AbsentOrLate', []);
angular.module('Filters', []);
angular.module('Ideas', []);

var app = angular.module('petutility',
[
  'ui.router',
  'ngCookies',
  'ngResource',
  'ngFileUpload',
  'appRoutes',
  'Login',
  'Selecao',
  'Etapa',
  'Candidato',
  'ui.calendar',
  'appRoutes',
  'PETiano',
  'Util',
  'RecordOfMeeting',
  'SideNav',
  'Finance',
  'Calendar',
  'templates',
  'AgendaPoint',
  'AbsentOrLate',
  'Filters',
  'Ideas'
]);

app
  .run(function($rootScope, $state, Request, $resource, $timeout, UserService, PETianoService, CandidatoService) {
    PETianoService.getAllPETianos(null);
    $rootScope.UserService = UserService;
    $rootScope.CandidatoService = CandidatoService;
    $rootScope.stateFac = $state;
    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams, options){
          if(!UserService.isAuthenticated() && !CandidatoService.isAuthenticated()
            && toState.data.authenticate) {
            event.preventDefault();
            $state.transitionTo('login');
          }
          if(CandidatoService.isAuthenticated()
            && !toState.data.authenticate) {
            event.preventDefault();
            $state.transitionTo('candidato.index');
          }
          if(UserService.isAuthenticated()
          && !toState.data.authenticate) {
            event.preventDefault();
            $state.transitionTo('logged.calendar');
          }
      }
    );
  });
