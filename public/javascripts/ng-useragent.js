(function (angular) {
'use strict';	

	angular.module('ngUserAgent', ['ngProgress'])	
		// TWEETER SERVICE AUTH AND QUERY
		.service('useragent', ['$http', function (http) {			
			return {
				asyncFetchAgents: function(useragent) {
					var queryUrl = '/useragentquery?agent='+useragent;
					var promise = http.get(queryUrl).then(function (response) {	
						return response;
					});
					return promise;
				},
				
				asyncFetchTypes: function() {
					var queryUrl = '/useragenttypequery';
					var promise = http.get(queryUrl).then(function (response) {	
						return response;
					});
					return promise;
				}

			};
        }])
		// DIRECTIVE
		.directive('useragent', ['useragent', 'ngProgress', '$timeout', '$location', '$anchorScroll',function(useragent, ngProgress, timeout, location, anchorScroll) {
			return {
				restrict : 'AE',
				scope: { url:'=' },			
				template: 
					'<div class="nicepanel">' + 
                        '<table><tr><td>Filter</td><td><input type="search" name="search" ng-model="q.agent"/></td></tr>' +
                        '<tr><td>Types</td><td><select ng-model="type" ng-options="t for t in types" ng-change="loadAgents()"></select></td></tr>' +
                        '<tr ng-repeat="w in results | filter:q"><td></td><td>{{w.agent}}</td></tr>' +
                        '</table>',
				link : function(scope, element, attrs) {
				    
				    scope.results = [];
				    scope.types = [];
				    scope.type = 'Windows';
				    
				    scope.loadAgents = function() {
				        scope.fetchIt(scope.type, scope.results);    
				    }
                    
					scope.fetchIt = function(type, result) {
					    
                     	//ngProgress.start();

						useragent.asyncFetchAgents( type , scope.results).then(function(d) {
						    scope.results = [];
						    for (var i=0;i<d.data.length;i++) {
						        scope.results.push({id:i, agent: d.data[i]});
						    }
							//ngProgress.stop();
							//timeout(ngProgress.complete(), 800);
						});
					};
					
					scope.fetchItType = function() {
					    
                     	//ngProgress.start();

						useragent.asyncFetchTypes().then(function(d) {
						    scope.types = d.data;
							//ngProgress.stop();
							//timeout(ngProgress.complete(), 800);
						});
					};
					
					scope.fetchItType();
					
					scope.fetchIt('Windows', scope.windows);
		
				}
			};
		}]);
})(angular);