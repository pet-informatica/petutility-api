angular
	.module('PETiano')
	.controller('ProfileController', function($rootScope, $scope, $timeout, $http, UserAPI, PETianoService, Upload)
	{
		$scope.localUser = {};

		$scope.editMode = false;
		$scope.toggleEditMode = () => {
			$scope.editMode = true;
			Materialize.updateTextFields();
		};

		$timeout(() => {
			angular.copy($rootScope.user, $scope.localUser);
			$timeout(() => {
				Materialize.updateTextFields();
			}, 100);
		}, 100, true);

		$scope.submitChanges = () => {
			var user = {},
				localUser = $scope.localUser,
				rootUser = $rootScope.user,
				files = $scope.files;
			if(localUser.Name !== rootUser.Name)
				user.Name = localUser.Name;
			if(localUser.Email !== rootUser.Email)
				user.Email = localUser.Email;
			if(localUser.Cpf !== rootUser.Cpf)
				user.Cpf = localUser.Cpf;
			if(localUser.Rg !== rootUser.Rg)
				user.Rg = localUser.Rg;
			if(files && files.Photo)
				user.Photo = files.Photo;
			if(files && files.CoverPhoto)
				user.CoverPhoto = files.CoverPhoto;
			$scope.editMode = false;
			Upload
				.upload({
					url: '/api/petiano/update',
					data: user
				})
				.then(function(result) {
						$scope.files = {};
						angular.copy(result.data, $rootScope.user);
						angular.copy(result.data, $scope.localUser);
						PETianoService.updatePETiano(result.data);
					}, function(err) {
						$scope.editMode = true;
					})
		};

		$scope.openChngPassword = () => {
			$('#chngPasswordModal').openModal();
		};

		$scope.changePassword = (oldPassword, newPassword) => {
			$http({
				method: 'POST',
				url: '/api/petiano/updatePassword',
				data: {
					oldPassword: oldPassword,
					newPassword: newPassword
				}
			}).then((response) => {
				$('#chngPasswordModal').closeModal();
				$scope.oldPassword = "";
				$scope.newPassword1 = "";
				$scope.newPassword2 = "";
			});
		}
	});
