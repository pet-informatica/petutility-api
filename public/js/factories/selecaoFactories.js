angular
  .module('Selecao')
  .factory('SelecaoAPI', function($resource) {
    return $resource('/api/selecao/:selecaoId', {selecaoId: '@Id'}, {
      'participar': {
        method: 'POST',
        url: '/api/selecao/:selecaoId/participar'
      }
    });
  });

angular
  .module('Selecao')
  .factory('EtapaAPI', function($resource) {
    return $resource('/api/selecao/:selecaoId/etapa/:etapaId', {selecaoId: '@SelecaoId', etapaId: '@Id'});
  });
