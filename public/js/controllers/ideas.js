angular
	.module('Ideas')
	.controller('IdeasController',
		function($scope, $timeout, $http, IdeasAPI) {

			$scope.toDeleteIdea = {};
			$scope.editingIdea = {};
			$scope.ideas = [];

			IdeasAPI.getIdeas((err, ideas) => {
				if(err) return;
				$scope.ideas = ideas;
			});

			$scope.delete = function(idea) {
				$scope.toDeleteIdea = idea;
				$('#deleteIdeaModal').openModal();
				$('#deleteModalButton').focus();
			};

			$scope.confirmDeleteIdea = function() {
				$('#deleteIdeaModal').closeModal();
				var t = $scope.toDeleteIdea;
				IdeasAPI.deleteIdea($scope.toDeleteIdea.Id, (err, data) => {
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

			$scope.addIdea = function() {
				Materialize.updateTextFields();
				$('#addIdeaModal').openModal();
				$('#toAddTitle').focus();
			};

			$scope.confirmAddIdea = function() {
				var idea = {};
				angular.copy($scope.ideaForm, idea);

				$('#addIdeaModal').closeModal();
				IdeasAPI.addIdea(idea.Title, idea.Description, (err, data) => {
					idea.Id = data.Id;
					$scope.ideas.push(idea);
				});
			};

			$scope.editIdea = (idea) => {
				$scope.editingIdea = {};
				angular.copy(idea, $scope.editingIdea);

				$('#editIdeaModal').openModal();
				$timeout(() => {Materialize.updateTextFields();}, 0);
				$('#editingDescription').focus();
			};

			$scope.confirmEditIdea = () => {
				$('#editIdeaModal').closeModal();
				var idea = $scope.editingIdea;

				IdeasAPI.updateIdea(idea.Id, idea.Title, idea.Description, (err, data) => {
					if(err) return;
					var id = -1;
					for(var i=0; i < $scope.ideas.length; i++){
						if($scope.ideas[i].Id == idea.Id){
							angular.copy(idea, $scope.ideas[i]);
							break;
						}
					}
				});
			};

			$scope.openNewIdeasModal = () => {
				$('#addNewIdeaModal').openModal();
				$('ul.tabs').tabs();
				$('.collapsible').collapsible({});
				Materialize.updateTextFields();
			};

		}
	);
