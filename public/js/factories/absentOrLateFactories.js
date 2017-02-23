angular
	.module('AbsentOrLate')
	.factory('AbsentOrLateAPI', function($resource) {
		return $resource('/api/absentOrLate/:id');
	})