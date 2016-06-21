(function() {
	'use strict';

	var app = angular.module('ors-star', []);

	app.directive('orsStar', ['$compile',function($compile) {
		return {
			restrict: 'AEC',
			scope: {
				n: '=note'
			},
			link: function(scope, element, attrs) {
				console.log('orsStar', arguments);
				scope.update = function(note) {
					console.log('update', arguments);
					scope.n = note;
				};
				scope.$watch('n', function() {
					var note = Number(scope.n);
					note = (isNaN(note)) ? 3 : note;
					note = (note > 5) ? 5 : note;
					note = (note < 0) ? 0 : note;
					var html = '';
					for (var i = 0; i < note; i++) {
						html += '<img ng-click="update(' + (i + 1) + ')" src="ors-star/img/yellow_star.png" />';
					}
					for (var i = note; i < 5; i++) {
						html += '<img ng-click="update(' + (i + 1) + ')" src="ors-star/img/white_star.png" />';
					}
					element.html(html);
					$compile(element.contents())(scope);
				});
			}
		};
	}]);
})();
