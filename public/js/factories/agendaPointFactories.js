angular
	.module('AgendaPoint')
	.factory('AgendaPointAPI', function($resource, Request) {
			var API = {
				deleteAgendaPoint: Request.send('delete', $resource('/api/agendaPoint/:agendaPointId/delete', {agendaPointId: '@id'})),
				addAgendaPoint: Request.send('post', $resource('/api/agendaPoint/create')),
				updateAgendaPoint: Request.send('post', $resource('/api/agendaPoint/:agendaPointId/update', {agendaPointId: '@AgendaPointId'}))
			};

			return {
				deleteAgendaPoint: (agendaPointId, done) => {
					API
						.deleteAgendaPoint({agendaPointId: agendaPointId})
						.then(function(data) {
							return done && done(null, data);
						}, function(err) {
							return done && done(err);
						});
				},
				addAgendaPoint: (title, description, petianoId, recordOfMeetingId, status, done) => {
					API
						.addAgendaPoint({Title: title, Description: description, PETianoId: petianoId, Status: status, RecordOfMeetingId: recordOfMeetingId})
						.then(function(data) {
							return done && done(null, data);
						}, function(err) {
							return done && done(err);
						});
				},
				updateAgendaPoint: (agendaPointId, title, description, done) => {
					API
						.updateAgendaPoint({AgendaPointId: agendaPointId, Title: title, Description: description})
						.then(function(data) {
							return done && done(null, data);
						}, function(err) {
							return done && done(err);
						})
				},
				changeStatus: (agendaPointId, status, done) => {
					API
						.updateAgendaPoint({AgendaPointId: agendaPointId, Status: status})
						.then(function(data) {
							return done && done(null, data);
						}, function(err) {
							return done && done(err);
						})
				}
			};
		}
	);