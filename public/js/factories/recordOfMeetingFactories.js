angular
	.module('RecordOfMeeting')
	.factory('RecordOfMeetingAPI', function($resource) {
			return $resource('/api/recordOfMeeting/:recordOfMeetingId', {}, {
				'close': {
					method: 'POST',
					url: '/api/recordOfMeeting/:recordOfMeetingId'
				},
				'open': {
					method: 'POST',
					url: '/api/recordOfMeeting/'
				}
			});
		}
	);
