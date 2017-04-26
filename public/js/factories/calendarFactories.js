angular
	.module('Calendar')
	.factory('CalendarAPI', function($resource, Request) {
		var API = $resource('/api/calendar/:eventId', {}, {
			'update': {
				method: 'PUT'
			}
		});

		return {
			getEvents: (done) => {
				API.query(
					function (data) {
						return done && done(null, data);
					}, function (err) {
						return done && done(err);
					}
				);
			},
			addEvent: (eventTitle, eventDate, eventTime, done) => {
				API.create({title: eventTitle, start: eventDate, time: eventTime},
					function(data) {
						return done && done(null, data);
					}, function(err) {
						return done && done(err);
					}
				);
			},
			deleteEvent: (eventId, done) => {
				API.remove({eventId: eventId},
					function(data) {
						return done && done(null,data);
					}, function(err) {
						return done && done(err);
					}
				);
			},
			updateEvent: (eventId, eventTitle, eventDate, eventTime, done) =>{
				API.update({eventId: eventId}, {title: eventTitle, start: eventDate, time: eventTime},
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
