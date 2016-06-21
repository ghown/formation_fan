(function() {
	'use strict';

	var app = angular.module('ors-star', []);

	app.directive('orsStar', function() {
		return {
			restrict: 'AEC',
			link: function(scope, element, attrs) {
				console.log('orsStar', arguments);
				var html = '';
				for (var i = 0; i < 2; i++){
					html += '<img src="ors-star/img/yellow_star.png" />';
				}
				for (var i = 0; i < 3; i++){
					html += '<img src="ors-star/img/white_star.png" />';
				}
				element.append(html);
			}
		};
	});
})();
