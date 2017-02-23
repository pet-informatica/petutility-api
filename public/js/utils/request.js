angular
	.module('Util')
	.factory('Request', function($q, $timeout, $rootScope){
		var resolveOrReject = function(deferred, result) {
			if(result.error) {
				deferred.reject(result.error);
			} else {
				deferred.resolve(result);
			}
		};

		var reject = function(deferred, result) {
			deferred.reject(result);
		};

		return {
			send: function(method, API, opts) {
				if(method === 'post') 
					method = 'save';
				opts = opts || {};
				function deferAPI(params) {
					var deferred = $q.defer();
					API[method](
						params,
			            resolveOrReject.bind(null, deferred),
			            reject.bind(null, deferred)
					);
					return deferred.promise;
				}

				return function(params) {
					return deferAPI(params);
				};
			}
		};
	})