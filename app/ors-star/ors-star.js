(function() {
	'use strict';

	var app = angular.module('ors-star', []);

	app.directive('orsStar', function() {
		return {
			restrict: 'AEC',
			link: function() {
			console.log('orsStar', arguments);
			}
		};
	});
})();
