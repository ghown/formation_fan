(function() {
	'use strict';

	var app = angular.module('ors-star', []);

	app.directive('orsStar', function() {
		return {
			restrict: 'AEC',
			link: function(scope, element, attrs) {
				console.log('orsStar', arguments);
				scope.$watch(attrs.note, function() {
					var note = Number(attrs.note);
					note = (isNaN(note)) ? Number(scope[attrs.note]) : note;
					note = (isNaN(note)) ? 3 : note;
					note = note > 5 ? 5 : note;
					note = note < 0 ? 0 : note;
					var html = '';
					for (var i = 0; i < note; i++){
						html += '<img src="ors-star/img/yellow_star.png" />';
					}
					for (var i = note; i < 5; i++){
						html += '<img src="ors-star/img/white_star.png" />';
					}
					element.html(html);
				});
				
			}
		};
	});
})();