(function() {
	'use strict';

	var app = angular.module('ors-http', []);

	app.config(['$httpProvider', '$provide', function($httpProvider, $provide) {
		
		// register the interceptor as a service
		$provide.factory('myHttpInterceptor', ['$injector', function($injector) {
			var $q = $injector.get('$q');
			var $rootScope = $injector.get('$rootScope');
			var $timeout = $injector.get('$timeout');
			var counter = 0;
			$rootScope.showSpinner = false;
			
			var startSpin = function() {

				counter++;
				$timeout(function() {
					if(counter > 0){
						console.log('Starting spinner', counter);
						$rootScope.showSpinner = true;
						$rootScope.$apply();
					}
				}, 500);
			}
			
			var stopSpin = function() {
				counter--;
				if(counter == 0){
					console.log('Stopping spinner', counter);
					$rootScope.showSpinner = false;
				}
			}
			
			return {
				// optional method
				'request': function(config) {
					// do something on success
					console.log('interceptor request', arguments);
					startSpin();
					return config;
				},

				// optional method
				'requestError': function(rejection) {
					console.log('interceptor requestError', arguments);
					stopSpin();
					// do something on error
					if (canRecover(rejection)) {
						return responseOrNewPromise
					}
					return $q.reject(rejection);
				},



				// optional method
				'response': function(response) {
					console.log('interceptor response', arguments);
					stopSpin();
					// do something on success
					return response;
				},

				// optional method
				'responseError': function(rejection) {
					console.log('interceptor responseError', arguments);
					stopSpin();
					// do something on error
					if (canRecover(rejection)) {
						return responseOrNewPromise
					}
					return $q.reject(rejection);
				}
			};
		}]);

		$httpProvider.interceptors.push('myHttpInterceptor');
	}]);


})();
