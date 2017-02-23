angular
	.module('Ideas')
	.factory('IdeasAPI', function($resource, Request) {
			var API = {
				addIdea: Request.send('post', $resource('/api/ideas/create')),
				getIdeas: Request.send('get', $resource('/api/ideas/')),
				deleteIdea: Request.send('delete', $resource('/api/ideas/:ideaId/delete', {ideaId: '@id'})),
				updateIdea: Request.send('post', $resource('/api/ideas/:ideaId/update', {ideaId: '@IdeaId'})),
			};

			return {  
				getIdeas: (done) => {
					API
						.getIdeas()
						.then(function(data) {
							return done && done(null, data);
						}, function(err) {
							return done && done(err);
						});
				},
				addIdea: (title, description, done) => {
					console.log(API.getIdeas)
					console.log(API.addIdea)
					API
						.addIdea({Title: title, Description: description})
						.then(function(data) {
							return done && done(null, data);
						}, function(err) {
							return done && done(err);
						});
				},
				updateIdea: (ideaId, title, description, done) => {
					API
						.updateIdea({IdeaId: ideaId, Title: title, Description: description})
						.then(function(data) {
							return done && done(null, data);
						}, function(err) {
							return done && done(err);
						})
				},
				deleteIdea: (ideaId, done) => {
					API
						.deleteIdea({ideaId: ideaId})
						.then(function(data) {
							return done && done(null, data);
						}, function(err) {
							return done && done(err);
						});
				}

			};
		}
	);