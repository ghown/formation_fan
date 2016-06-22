(function() {
	'use strict';

	describe('ors-services', function() {
	
		beforeEach(module('ors-services'));
		
		describe('ors-services.Ctrl', function() {
			var $scope;
			var $http;
			var $controller;
			var $rootScope;
		
			beforeEach(inject(['$injector', function($injector) {
				$http = $injector.get('$httpBackend');
				$controller = $injector.get('$controller');
				$rootScope = $injector.get('$rootScope');
				
				$scope = $rootScope.$new();
				$controller('ors-services.Ctrl', {$scope: $scope});
				
				$http.when('GET', '../ws/releve.csv').respond('Libellé;Date;Débit;Crédit\n' + 'PC Gamer;25/06/2016;1300.00;\n' + 'Salaire;26/06/2016;;5084.26\n' + 'Ferrari;30/06/2016;50899.82;');
			}]));
				
			it('should show correctly the csv file', function() {
				$http.expectGET('../ws/releve.csv');
				$http.flush();
				expect($scope.lines.length).toEqual(3);
			});
		});
	});
})();

