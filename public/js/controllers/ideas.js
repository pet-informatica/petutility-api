angular
	.module('Ideas')
	.controller('IdeasController',
		function($scope,
					$timeout,
					$http,
					IdeasAPI) {

			$scope.ideaForm = {
				Title: "Nome da ideia"
			};

			$scope.toDeleteIdea = {};
			$scope.editingIdea = {};
			$scope.ideas = [];

			$http({
				method: 'GET',
				url: '/api/ideas/open'
			}).then((result) => {
				$scope.canOpen = result.data.open;
			}, (result) => {
				$scope.canOpen = true;
			});

			IdeasAPI.getIdeas((err, data) => {
				if(err) return;
				$scope.ideas = data.ideas;
			});


			$scope
				.delete = function(idea) {
					$scope.toDeleteIdea = idea;
					$('#deleteIdeaModal').openModal();
					$('#deleteModalButton').focus();
				};


			$scope
				.confirmDeleteIdea = function() {
					$('#deleteIdeaModal').closeModal();
					var t = $scope.toDeleteIdea;
					IdeasAPI
						.deleteIdea($scope.toDeleteIdea.Id, (err, data) => {
							if(err) return;
							var id = -1;
							for(var i=0; i < $scope.ideas.length; i++){
								if($scope.ideas[i].Id == t.Id){
									id = i;
									break;
								}
							}
							$scope.ideas.splice(id, 1);
							$scope.toDeleteIdea = {};
						});

				};

			$scope
				.addIdea = function() {
					Materialize.updateTextFields();
					$('#addIdeaModal').openModal();
					$('#toAddTitle').focus();
				}

			$scope
				.confirmAddIdea = function() {
					var idea = {};
					angular.copy($scope.ideaForm, idea);

					$('#addIdeaModal').closeModal();
					console.log(idea)
					IdeasAPI
						.addIdea(idea.Title, idea.Description, (err, data) => {
							idea.Id = data.Id;
							$scope.ideas.push(idea);
							// if(err)
							// {
							// 	//$scope.ideas.splice(t.idx, 1);
							// }
							// else
							// {
							// 	$scope.ideas.push(idea);
							// 	//t.ideaId = data.Id;
							// 	//$scope.toAddIdea = {};
							// 	$('.tooltipped').tooltip();
							// }
						});
				};

			$scope
				.editIdea = (idea) => {
					$scope.editingIdea = {};
					angular.copy(idea, $scope.editingIdea);

					$('#editIdeaModal').openModal();
					$timeout(() => {Materialize.updateTextFields();}, 0);
					$('#editingDescription').focus();
				};

			$scope
				.confirmEditIdea = () => {
					$('#editIdeaModal').closeModal();
					var idea = $scope.editingIdea;

					IdeasAPI
						.updateIdea(idea.Id,
											idea.Title,
											idea.Description,
											(err, data) => {
												if(err)
												{
													return;
												}

												var id = -1;
												for(var i=0; i < $scope.ideas.length; i++){
													if($scope.ideas[i].Id == idea.Id){
														angular.copy(idea, $scope.ideas[i]);
														break;
													}
												}

											});
					
				}


			$scope
				.openNewIdeasModal = () => {
					$('#addNewIdeaModal').openModal();
					$('ul.tabs').tabs();
					$('.collapsible').collapsible({});
					Materialize.updateTextFields();
				}

			$scope
				.addNewIdea = () => {
					$scope.toAddNewIdea.Status = 1;
					var t = $scope.toAddNewIdea;
					$scope.toAddNewIdea = {};
					var tIdx = $scope.UsersIdeas.length;
					$scope.UsersIdeas.push(t);
					$http({method: 'POST', url: '/api/idea/create', data: t})
						.then((result) => {
							t.Id = result.data.Id;
							Materialize.updateTextFields();
						}, (err) => {
							$scope.toAddNewIdea = t;
							$scope.UsersIdeas.splice(tIdx, 1);
							Materialize.updateTextFields();
						})
				}

			/*$http({method: 'GET', url: 'api/idea/users'})
				.then((result) => {
					$scope.UsersIdeas = result.data;
				}, (err) => {
					$scope.UsersIdeas = [];
				})*/
		}
	);