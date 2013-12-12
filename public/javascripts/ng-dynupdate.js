(function (angular) {
'use strict';	

	angular.module('ngDynupdate', [])	
		// TWEETER SERVICE AUTH AND QUERY
		.service('dynupdate', ['$http', function (http) {			
			return {
				asyncDynupdate: function(domain, ip, auth) {
					var queryUrl = '/querydynupdate?domain='+domain+'&ip='+ip+'&auth='+auth;
					var promise = http.get(queryUrl, {}).then(function (response) {						
						return response;
					});
					return promise;
				}
			};
        }])
		// DIRECTIVE
		.directive('dynupdate', ['dynupdate', function(dynupdate) {
			return {
				restrict : 'AE',
				scope: { domain:'=', ip:'=', auth:'='},			
				template: 
					'<div class="panel">' + 
                        '<input type="text" name="input" ng-model="domain">' +
                        '<input type="text" name="input" ng-model="ip">' +
                        '<input type="text" name="input" ng-model="auth">' +
						'<button name="update" ng-click="dynupdate()">Dynupdate</button>' +
					'</div><div>' +
                        '<pre json="json" pretty-json />' +
					'</div>',
				link : function(scope, element, attrs) {
                    scope.json = {json: {'action': 'click button first'}};

					scope.dynupdate = function() {
						dynupdate.asyncDynupdate(scope.domain, scope.ip, scope.auth).then(function(d) {
							scope.json = {json: {'result': d}};
						});
					};
		
				}
			};
		}]);
})(angular);