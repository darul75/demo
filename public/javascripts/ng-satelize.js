(function (angular) {
'use strict';	

	angular.module('ngSatelize', [])	
		// TWEETER SERVICE AUTH AND QUERY
		.service('satelize', ['$http', function (http) {			
			return {
				asyncSatelize: function(ip) {
					var queryUrl = '/querysatelize?ip='+ip;
					var promise = http.get(queryUrl, {}).then(function (response) {						
						return response;
					});
					return promise;
				}
			};
        }])
		// DIRECTIVE
		.directive('satelize', ['satelize', function(satelize) {
			return {
				restrict : 'AE',
				scope: { ip:'='},			
				template: 
					'<div class="panel">' + 
                        '<input type="text" name="input" ng-model="ip">' +
						'<button name="start" ng-click="satelize()">Satelize</button>' +
					'</div><div>' +
                        '<pre json="json" pretty-json />' +
					'</div>',
				link : function(scope, element, attrs) {
                    scope.json = {json: {'action': 'click button first'}};

					scope.satelize = function() {
						satelize.asyncSatelize(scope.ip).then(function(d) {
							scope.json = {json: d.data};
						});
					};
		
				}
			};
		}]);
})(angular);