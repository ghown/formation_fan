(function() {
	'use strict';

	angular.module('templates', []);

	var app = angular.module('mainApp', ['templates','ors-star']);

	app.directive('orsHeader', function() {
		return {
			restrict: 'AEC',
			templateUrl: 'tmpl/ors-header.html',
			transclude: true
		};
	});

	app.directive('orsBody', function() {
		return {
			restrict: 'AEC',
			templateUrl: 'tmpl/ors-body.html',
			transclude: true
		};
	});

	app.directive('orsFooter', function() {
		return {
			restrict: 'AEC',
			templateUrl: 'tmpl/ors-footer.html',
			transclude: true
		};
	});
})();
