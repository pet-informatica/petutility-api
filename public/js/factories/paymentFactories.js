angular
	.module('Finance')
	.factory('PaymentAPI', ['Request', 'UserService', '$resource', '$cookies',
			function(Request, UserService, $resource, $cookies) {
		var API = {
			getPayments: Request.send('get', $resource('/api/payment/getPayments')),
			createPayment: Request.send('save', $resource('/api/payment/createPayment')),
			getPendingPaymentsPigPet: Request.send('query', $resource('/api/payment/getPendingPaymentsPigPet')),
			deletePayment: Request.send('remove', $resource('/api/payment/deletePayment')),
			updatePayment: Request.send('save', $resource('/api/payment/updatePayment')),
			acceptPayment: Request.send('save', $resource('/api/payment/acceptPayment'))
		};

		return {
			getPayments: (done) => {
				API
					.getPayments()
					.then(function(data) {
						return done && done(null, data.arr);
					}, function(err) {
						return done && done(err);
					})
			},
			createPayment: (payment, done) => {
				API.createPayment(payment)
				.then(function(data) {
					return done && done(null, data);
				}, function(err) {
					return err;
				})
			},
			getPendingPaymentsPigPet: (done) => {
				API.getPendingPaymentsPigPet()
					.then(function(data) {
						return done && done(null, data);
					}, function(err) {
						return done && done(err);
					})
			},
			deletePayment: (payment, done) => {
				API.deletePayment(payment)
				.then(function() {
					return done && done();
				}, function(err) {
					return done && done(err);
				})
			},
			updatePayment: (payment, done) => {
				API.updatePayment(payment)
				.then(function(data) {
					return done && done(null, data);
				}, function(err) {
					return done && done(err);
				})
			},
			acceptPayment: (payment, done) => {
				API.acceptPayment(payment)
				.then(function(data) {
					return done && done(null, data);
				}, function(err){
					console.log("erro fac");
					return done && done(err);
				})
			}
		}
	}]);
