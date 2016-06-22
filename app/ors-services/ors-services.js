(function() {
	'use strict';

	var app = angular.module('ors-services', []);
	
	app.controller('ors-services.Ctrl', ['$scope', '$injector', function($scope, $injector) {
		console.log('ctrl', arguments);
		var $http = $injector.get('$http');
		$http.get('../ws/releve.csv').then(function(response) {
			$scope.releveCsv = response.data;
		}).catch(function(error) {
			console.error('error', error);
		})
	}]);
})();
