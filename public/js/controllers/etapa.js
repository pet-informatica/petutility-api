angular
  .module('Etapa')
  .controller('EtapaController', function($scope, $http, SelecaoAPI, EtapaAPI, $stateParams) {
    $scope.etapa = EtapaAPI.get({selecaoId: $stateParams.selecaoId, etapaId: $stateParams.etapaId});
    $scope.etapas = EtapaAPI.query({selecaoId: $stateParams.selecaoId});

    $scope.closeEtapa = function() {
      $scope.etapa.CanUpdate = false;
      $scope.etapa.$save();
    };

    $scope.openEtapa = function() {
      $scope.etapa.CanUpdate = true;
      $scope.etapa.$save();
    };
  }
);
