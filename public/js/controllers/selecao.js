angular
  .module('Selecao')
  .controller('SelecaoDisplayController', function($scope, SelecaoAPI, EtapaAPI) {
    $scope.selecoes = SelecaoAPI.query({});

    $scope.openModal = function(modalId) {
      $scope.$evalAsync(Materialize.updateTextFields);
      $('#' + modalId).openModal();
    }

    $scope.addSelecao = function(toAddSelecao) {
      $('#addSelecaoModal').closeModal();
      $scope.selecoes.push(toAddSelecao = new SelecaoAPI({
        Description: toAddSelecao.Description,
        IsOpen: false
      }));

      toAddSelecao.$save(function() {
        $scope.toAddSelecao = {};
      });
    }
  }
);

angular
  .module('Selecao')
  .controller('SelecaoDetailController', function($stateParams, $scope, SelecaoAPI, EtapaAPI) {
    $scope.selecao = SelecaoAPI.get({selecaoId: $stateParams.selecaoId});

    $scope.openModal = function(modalId) {
      $scope.$evalAsync(Materialize.updateTextFields);
      $('#' + modalId).openModal();
    }

    $scope.addEtapa = function(toAddEtapa) {
      $('#addEtapaModal').closeModal();
      $scope.selecao.Etapas.push(toAddEtapa = new EtapaAPI({
        SelecaoId: $scope.selecao.Id,
        CanUpdate: true,
        Description: toAddEtapa.Description
      }));

      toAddEtapa.$save(function() {
        $scope.toAddEtapa = {};
      });
    }

    $scope.updateSelecaoIsOpen = function(IsOpen) {
      $('#closeSelecaoModal').closeModal();
      $scope.selecao.IsOpen = IsOpen;
      $scope.selecao.$save(function() {
        $scope.selecao = SelecaoAPI.get({selecaoId: $scope.selecao.Id});
      });
    }
  }
);
