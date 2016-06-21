(function() {
	'use strict';

	angular.module('templates', []);

	var app = angular.module('mainApp', ['templates','ors-star','ngRoute']);

	app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

		$locationProvider
		.html5Mode(true)
		.hashPrefix('!');

		$routeProvider
			.when('/', {
				templateUrl: 'tmpl/menu/home.html'
			})
			.when('/products', {
				templateUrl: 'tmpl/menu/products.html'
			})
			.when('/services', {
				templateUrl: 'tmpl/menu/services.html'
			})
			.when('/contact', {
				templateUrl: 'tmpl/menu/contact.html'
			})
			.otherwise({
				redirectTo: '/'
			});
	}]);

	app.run(['$rootScope',function($rootScope) {
		console.log('Sbra', arguments);
		$rootScope.myNote = 2;
	}]);

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
