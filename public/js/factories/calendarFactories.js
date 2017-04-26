angular
	.module('Calendar')
	.factory('CalendarAPI', function($resource, Request) {
		return $resource('/api/calendar/:eventId', {}, {
			'update': {
				method: 'PUT'
			}
		});

	}
);
