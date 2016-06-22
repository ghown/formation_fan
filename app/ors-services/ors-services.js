(function() {
	'use strict';

	var app = angular.module('ors-services', []);
	
	app.controller('ors-services.Ctrl', ['$scope', '$injector', function($scope, $injector) {
		console.log('ctrl', arguments);
		var $http = $injector.get('$http');
		$http.get('../ws/releve.csv').then(function(response) {
			var data = Papa.parse(response.data, {
				header: true
			});
			$scope.lines = data.data;
		}).catch(function(error) {
			console.error('error', error);
		})
	}]);
})();
