angular
	.module('Finance')
	.factory('PaymentAPI', function($resource) {
		var API = $resource('/api/payment/:paymentId', {}, {
			'accept': {
				method: 'POST',
				url: '/api/payment/:paymentId/accept'
			}
		});

		return {
			getPayments: (done) => {
				API.query(function(data) {
						return done && done(null, data);
					}, function(err) {
						return done && done(err);
					})
			},
			createPayment: (payment, done) => {
				API.save(payment, function(data) {
					return done && done(null, data);
				}, function(err) {
					return err;
				})
			},
			deletePayment: (payment, done) => {
				API.delete({paymentId: payment.Id}, function() {
					return done && done();
				}, function(err) {
					return done && done(err);
				})
			},
			updatePayment: (payment, done) => {
				API.update({paymentId: payment.Id}, payment, function(data) {
					return done && done(null, data);
				}, function(err) {
					return done && done(err);
				})
			},
			acceptPayment: (payment, done) => {
				API.accept({paymentId: payment.Id}, {}, function(data) {
					return done && done(null, data);
				}, function(err){
					return done && done(err);
				})
			}
		}
	}
);
