angular
  .module('Candidato')
  .controller('CandidatoController', function($rootScope, $scope, $timeout, CandidatoAPI, SelecaoAPI, EtapaAPI, Upload) {
    $scope.candidato = {};
    $scope.selecao = {};
    $scope.etapa = {};
    $scope.iAgree = false;
    $scope.isTimeouting = true;
    $timeout(function() {
      angular.copy($rootScope.user, $scope.candidato);
      if($scope.candidato.EtapaId) {
        EtapaAPI.get({selecaoId: $scope.candidato.SelecaoId, etapaId: $scope.candidato.EtapaId},
        function(etapa) {
          $scope.etapa = etapa;
        },
        function(err) {
          console.log(err);
        });
      }
      SelecaoAPI.get({}, function(selecao) {
        $scope.selecao = selecao;
      }, function(err) {
        console.log(err);
      });
      $scope.isTimeouting = false;
    }, 1000);

    function updateCandidato(candidato) {
      $scope.candidato = candidato;
      $timeout(function () {
        angular.copy($scope.candidato, $rootScope.user);
      }, 1000);
    }

    $scope.logout = function() {
      CandidatoAPI.logout();
    };

    $scope.update = function() {
      Upload.upload({
        url: '/api/candidato/update',
        data: {
          Curriculum: $scope.candidato.Curriculum,
          ScholarHistoric: $scope.candidato.ScholarHistoric
        }
      }).then(function(res) {
        updateCandidato(res.data);
      }, function(err) {
        console.log(err);
      }, function(evt) {
        // console.log('fazendo update');
      });
    };

    $scope.join = function() {
      SelecaoAPI.participar({selecaoId: $scope.selecao.Id}, {}, function(candidato) {
        updateCandidato(candidato);
      }, function(err) {
        console.log(err);
      });
    };

  }
);
