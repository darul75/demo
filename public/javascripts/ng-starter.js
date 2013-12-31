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
				},

				asyncStarterDaemonStart: function(options) {
					var queryUrl = '/querystarterdaemonstart';
					
					var promise = http.post(queryUrl, options).then(function (response) {						
						return response;
					});
					return promise;
				},

				asyncStarterDaemonStop: function(options) {
					var queryUrl = '/querystarterdaemonstop';
					
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
						'<table>' +
                        '<tr><td>Access Key</td><td><input type="text" name="accessKeyId" ng-model="options.accessKeyId"></td></tr>' +
                        '<tr><td>Secret Key</td><td><input type="text" name="secretAccessKey" ng-model="options.secretAccessKey"></td></tr>' +
                        '<tr><td>Region</td><td><input type="text" name="region" ng-model="options.region"></td></tr>' +
                        '<tr><td>Instance(s) Id ("," separator)</td><td><input type="text" name="instancesId" ng-model="options.instancesId"></td></tr></table></div>' +
                    '<div class="panel">' +    
						'<button name="start" ng-click="start()">Start Instance(s)</button>' +
						'<button name="stop" ng-click="stop()">Stop Instance(s)</button>' +					
					'</div><div>' +
                        '<pre json="json" pretty-json />' +
					'</div>' +
					'<div class="panel">' +    						
						'<button name="start" ng-click="startDaemon()">Start daemon</button>' +
						'<button name="stop" ng-click="stopDaemon()">Stop daemon</button>' +
					'</div>' +
					'<div>' +    
						'<pre json="json2" pretty-json />' +
					'</div>',
				link : function(scope, element, attrs) {
                    scope.json = {json: {'action': 'click button first'}};
                    scope.json2 = {json: {'action': 'click button first'}};

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

					scope.startDaemon = function() {
					    scope.options.state = 'start'; 
						starter.asyncStarterDaemonStart(scope.options).then(function(d) {
							scope.json2 = {json: d.data};
						});
					};

					scope.stopDaemon = function() {
					    scope.options.state = 'start'; 
						starter.asyncStarterDaemonStop(scope.options).then(function(d) {
							scope.json2 = {json2: d.data};
						});
					};
		
				}
			};
		}]);
})(angular);