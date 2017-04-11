angular
	.module('AgendaPoint')
	.factory('AgendaPointAPI', function($resource, Request) {
		var API = $resource('/api/agendaPoint/:AgendaPointId', {}, {
			'update': {
				method: 'PUT'
			}
		});

		return {
			deleteAgendaPoint: (agendaPointId, done) => {
				API.remove({AgendaPointId: agendaPointId},
					function(data) {
						return done && done(null, data);
					}, function(err) {
						return done && done(err);
					});
			},
			addAgendaPoint: (title, description, petianoId, recordOfMeetingId, status, done) => {
				API.create({Title: title, Description: description, PETianoId: petianoId, Status: status, RecordOfMeetingId: recordOfMeetingId},
					function(data) {
						return done && done(null, data);
					}, function(err) {
						return done && done(err);
					});
			},
			updateAgendaPoint: (agendaPointId, title, description, done) => {
				API.update({AgendaPointId: agendaPointId}, {Title: title, Description: description},
					function(data) {
						return done && done(null, data);
					}, function(err) {
						return done && done(err);
					})
			},
			changeStatus: (agendaPointId, status, done) => {
				API.update({AgendaPointId: agendaPointId}, {Status: status},
					function(data) {
						return done && done(null, data);
					}, function(err) {
						return done && done(err);
					})
			}
		};

	}
);
