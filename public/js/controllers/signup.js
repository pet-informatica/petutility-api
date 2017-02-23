angular
  .module('Candidato')
  .controller('SignupController', function($scope, Upload, CandidatoAPI) {
    $scope.user = {};
    $scope.errMsg = '';
    $scope.isSubmiting = false;

    $scope.submit = function() {
      var user = $scope.user;
      if(user.password!=user.confirmPassword) {
        $scope.errMsg = 'Senhas não conferem!';
      } else {
        $scope.isSubmiting = true;
        Upload
          .upload({
            url: '/api/candidato/signup',
            data: user
          })
          .then(function(data) {
            CandidatoAPI.loginNewUser(data);
            $scope.isSubmiting = false;
          }, function(err) {
            $scope.errMsg = err.status + ' - ' + err.data.message;
            $scope.isSubmiting = false;
          });
      }
    }

  }
);
