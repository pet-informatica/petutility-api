angular
	.module('Calendar')
	.factory('CalendarAPI', function($resource) {
		return $resource('/api/calendar/:eventId', {}, {
			'update': {
				method: 'PUT'
			}
		});

	}
);
