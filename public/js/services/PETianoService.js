angular
	.module('PETiano')
	.service('PETianoService', function(Request, $resource) {
		var $scope = this;
		$scope.resource = $resource;
		var users = {}, allRequested = false;
		
		$scope
			.getPETianoById = (Id, callback) => {
				if(!!users[Id])
					return callback(null, users[Id]);
				Request
					.send('get', $scope.resource('/api/petiano/:petianodId', {petianoId: Id}))({})
					.then(function(data) {
						users[Id] = data;
						return callback && callback(null, users[Id]);
					}, function(err) {
						return callback && callback(err);
					})
			};

		$scope
			.getAllPETianos = (callback) => {
				if(allRequested)
					return callback(null, users);
				Request
					.send('query', $scope.resource('/api/petiano'))({})
					.then(function(data) {
						for(var idx = 0; idx < data.length; ++idx)
						{
							var petiano = data[idx];
							users[petiano.Id] = petiano;
						}
						allRequested = true;
						return callback && callback(null, users);
					}, function(err) {
						return callback && callback(err);
					})
			};

		$scope
			.updatePETiano = (PETiano) => {
				users[PETiano.Id] = PETiano;
			};
	});