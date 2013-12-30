(function (angular) {
'use strict';	

	angular.module('ngStarter', [])	
		// TWEETER SERVICE AUTH AND QUERY
		.service('starter', ['$http', function (http) {			
			return {
				asyncStarter: function(options) {
					var queryUrl = '/querystarter';
					
					var promise = http.post(queryUrl, options).then(function (response) {						
						return response;
					});
					return promise;
				}
			};
        }])
		// DIRECTIVE
		.directive('starter', ['starter', function(starter) {
			return {
				restrict : 'AE',
				scope: { options:'='},			
				template: 
					'<div class="panel">' + 
                        '<input type="text" name="accessKeyId" ng-model="options.accessKeyId">' +
                        '<input type="text" name="secretAccessKey" ng-model="options.secretAccessKey">' +
                        '<input type="text" name="region" ng-model="options.region">' +
                        '<input type="text" name="instancesId" ng-model="options.instancesId">' +
						'<button name="start" ng-click="start()">Start</button>' +
						'<button name="stop" ng-click="stop()">Stop</button>' +
					'</div><div>' +
                        '<pre json="json" pretty-json />' +
					'</div>',
				link : function(scope, element, attrs) {
                    scope.json = {json: {'action': 'click button first'}};

					scope.start = function() {
					    scope.options.state = 'start'; 
						starter.asyncStarter(scope.options).then(function(d) {
							scope.json = {json: d.data};
						});
					};
					
					scope.stop = function() {
					    scope.options.state = 'stop'; 
						starter.asyncStarter(scope.options).then(function(d) {
							scope.json = {json: d.data};
						});
					};
		
				}
			};
		}]);
})(angular);