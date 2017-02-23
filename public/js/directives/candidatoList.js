angular
  .module('Selecao')
  .directive('candidatoList', function() {
    return {
      restrict: 'E',
      scope: {
        candidatos: '=',
        etapas: '=',
        toDelete: '=',
        selecaoId: '='
      },
      controller: function($scope, $http) {
        $scope.openCandidatoListModal = function() {
          $('#candidatoListModal').openModal();
        }

        $scope.move = function(etapa) {
          $('#candidatoListModal').closeModal();

          var toMove = $scope.candidatos;

          if(!$scope.selectAll)
            toMove = toMove.filter(function(candidato) {
              return candidato.selected;
            });
          function moveCandidato(candidato) {
            $http({
              method: 'PUT',
              url: '/api/selecao/' + $scope.selecaoId + '/etapa/' + etapa.Id + '/candidato/' + candidato.Id
            }).then(function() {
              if($scope.toDelete)
                $scope.candidatos.splice($scope.candidatos.findIndex(function(val) {
                  return val.Id == candidato.Id
                }), 1);
            });
          }

          toMove.forEach(moveCandidato);
        }

        $scope.aprove = function() {
          $('#candidatoListModal').closeModal();

          var toMove = $scope.candidatos;

          if(!$scope.selectAll)
            toMove = toMove.filter(function(candidato) {
              return candidato.selected;
            });

          function aproveCandidato(candidato) {
            $http({
              method: 'POST',
              url: '/api/selecao/' + $scope.selecaoId + '/aprovado/' + candidato.Id
            }).then(function() {
              $scope.candidatos.splice($scope.candidatos.findIndex(function(val) {
                return val.Id == candidato.Id
              }), 1);
            });
          }

          toMove.forEach(aproveCandidato);
        }
      },
      templateUrl: 'public/templates/directives/candidatoList.html'
    };
  });