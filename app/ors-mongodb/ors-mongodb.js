(function() {
	'use strict';

	var app = angular.module('ors-mongodb', ['ngDialog']);

	app.run(['$injector', function($injector) {
		var $http = $injector.get('$http');
		var $rootScope = $injector.get('$rootScope');
		var ngDialog = $injector.get('ngDialog');
		
		$rootScope.checked = {};
		
		$rootScope.hasItemSelected = function() {
			for (var prop in $rootScope.checked) {
				if ($rootScope.checked[prop]) {
					return true;
				}
			}
			return false;
		};
		
		$rootScope.$watch('result', function() {
			$rootScope.checked = {};
		});
		
		$rootScope.open = function(record) {
			$rootScope.obj = angular.copy(record);
			
			ngDialog.open({
				template: 'popup.html',
				controller: ['$scope', '$injector', function($scope, $injector) {
					$rootScope.closeThisDialog = function() {
						$scope.closeThisDialog();
					};
				}]
			});
		};
		
		$rootScope.create = function() {
			$http({
				method: 'POST',
				url: '../../ws/sandbox/crud/create',
				data: {
					name: $rootScope.obj.name,
					age: Number($rootScope.obj.age)
				}
			}).then(function(response) {
				$rootScope.createMessage = response.data;
			}).then(function() {
				$rootScope.retrieve();
			}).catch(function(error) {
				$rootScope.createMessage = 'error';
				console.log('Error', error);
			});
		};
	}]);
})();
