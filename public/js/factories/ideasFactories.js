angular
	.module('Ideas')
	.factory('IdeasAPI', function($resource) {
			var API = $resource('/api/ideas/:ideaId');

			return {
				getIdeas: (done) => {
					API.query(function(data) {
						return done && done(null, data);
					}, function(err) {
						return done && done(err);
					});
				},
				addIdea: (title, description, done) => {
					API.save({Title: title, Description: description}, function(data) {
						return done && done(null, data);
					}, function(err) {
						return done && done(err);
					});
				},
				updateIdea: (ideaId, title, description, done) => {
					API.update({ideaId: ideaId}, {Title: title, Description: description}, function(data) {
						return done && done(null, data);
					}, function(err) {
						return done && done(err);
					});
				},
				deleteIdea: (ideaId, done) => {
					API.delete({ideaId: ideaId}, function(data) {
						return done && done(null, data);
					}, function(err) {
						return done && done(err);
					});
				}

			};
		}
	);
