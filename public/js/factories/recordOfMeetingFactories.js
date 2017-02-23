angular
	.module('RecordOfMeeting')
	.factory('RecordOfMeetingAPI', function($resource, Request) {
			var API = {
				getLastRecordOfMeeting: Request.send('get', $resource('/api/recordOfMeeting')),
				updateAteiroOrPresident: Request.send('post', $resource('/api/recordOfMeeting/updateAteiroOrPresident')),
				saveRecordOfMeeting: Request.send('post', $resource('/api/recordOfMeeting/save/:RecordOfMeetingId', {RecordOfMeetingId: '@RecordOfMeetingId'}))
			};

			return {
				getLastRecordOfMeeting: (done) => {
					API
						.getLastRecordOfMeeting()
						.then(function (data) {
								return done && done(null, data);
							}, function (err) {
								return done && done(err);
							}
						);
				},
				updateAteiroOrPresident: (recordOfMeetingId, ateiroId, presidentId, done) => {
					API
						.updateAteiroOrPresident({Id: recordOfMeetingId, AteiroId: ateiroId, PresidentId: presidentId})
						.then(function(data) {
							return done && done(null, data);
						}, function(err) {
							return done && done(err);
						});
				},
				saveRecordOfMeeting: (recordOfMeetingId, done) => {
					API
						.saveRecordOfMeeting({RecordOfMeetingId: recordOfMeetingId})
						.then(function(data) {
							return done && done(null, data);
						}, function(err) {
							return done && done(err);
						});
				}
			};
		}
	);