angular
	.module('Filters')
	.filter('NoEgressosFilter', () => {
		return function(input) {
			var results = [];
			angular.forEach(input, (petiano) => {
				if(petiano.Profile && petiano.Profile != 4)
					results.push(petiano);
			})
			return results;
		};
	});