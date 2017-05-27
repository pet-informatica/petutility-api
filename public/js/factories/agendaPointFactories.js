angular
	.module('AgendaPoint')
	.factory('AgendaPointAPI', function($resource) {
		var API = $resource('/api/agendaPoint/:agendaPointId');

		return {
			deleteAgendaPoint: (agendaPointId, done) => {
				API.remove({agendaPointId: agendaPointId},
					function(data) {
						return done && done(null, data);
					}, function(err) {
						return done && done(err);
					}
				);
			},
			addAgendaPoint: (agendaPoint, done) => {
				API.save(agendaPoint,
					function(data) {
						return done && done(null, data);
					}, function(err) {
						return done && done(err);
					}
				);
			},
			updateAgendaPoint: (agendaPointId, title, description, done) => {
				API.update({agendaPointId: agendaPointId}, {Title: title, Description: description},
					function(data) {
						return done && done(null, data);
					}, function(err) {
						return done && done(err);
					}
				);
			},
			changeStatus: (agendaPoint, status, done) => {
				API.update({agendaPointId: agendaPoint.Id}, {Status: status, RecordOfMeetingId: agendaPoint.RecordOfMeetingId},
					function(data) {
						return done && done(null, data);
					}, function(err) {
						return done && done(err);
					}
				);
			},
			getAgendaPoints: (done) => {
				API.query(
					function(data) {
						return done && done(null, data);
					}, function(err) {
						return done && done(err);
					}
				);
			}
		};

	}
);
