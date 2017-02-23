angular
	.module('Calendar')
	.factory('CalendarAPI', function($resource, Request) {
			var API = {
				getEvents: Request.send('query', $resource('/api/calendar')),
				addEvent: Request.send('post', $resource('/api/calendar/save', {title: '@eventTitle', start: '@eventDate', 
																					time: '@eventTime'})),
				deleteEvent: Request.send('delete', $resource('/api/calendar/:eventId/delete', {eventId: '@eventId'})),
				updateEvent: Request.send('post', $resource('/api/calendar/:eventId/update', {eventId: '@eventId'}))
			};

			return {
				getEvents: (done) => {
					API
						.getEvents()
						.then(function (data) {
								return done && done(null, data);
							}, function (err) {
								return done && done(err);
							}
						);
				},
				addEvent: (eventTitle, eventDate, eventTime, done) => {
						API 
						.addEvent({title: eventTitle, start: eventDate, time: eventTime})
						.then(function(data) {
							return done && done(null, data);
						}, function(err) {
							return done && done(err);
						});
					},
				deleteEvent: (eventId, done) => {
					API.deleteEvent({eventId: eventId})
					.then(function(data){
						return done && done(null,data);
					}, function(err){
						return done && done(err);
					});
				},
				updateEvent: (eventId, eventTitle, eventDate, eventTime, done) =>{
					API 
					.updateEvent({eventId: eventId, title: eventTitle, start: eventDate, time: eventTime})
					.then(function(data) {
						return done && done(null, data);
					}, function(err) {
						return done && done(err);
					});
				}
			};

			
		}
	);