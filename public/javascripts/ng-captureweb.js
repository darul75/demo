(function (angular) {
'use strict';	

	angular.module('ngCaptureWeb', ['ngProgress'])	
		// TWEETER SERVICE AUTH AND QUERY
		.service('captureweb', ['$http', function (http) {			
			return {
				asyncCaptureWeb: function(data) {
					var queryUrl = '/capturewebquery';
					var promise = http.post(queryUrl, data).then(function (response) {	
						return response;
					});
					return promise;
				},

				asyncCaptureWebPdf: function(data) {
					var queryUrl = '/capturewebquerypdf';
					var promise = http.post(queryUrl, data).then(function (response) {	
						return response;
					});
					return promise;
				}
			};
        }])
		// DIRECTIVE
		.directive('captureweb', ['captureweb', 'ngProgress', '$timeout', function(captureweb, ngProgress, timeout) {
			return {
				restrict : 'AE',
				scope: { url:'=' },			
				template: 
					'<div class="panel">' + 
                        '<table><tr><td>Url</td><td><input type="text" name="input" ng-model="url"></td></tr>' +
                        '<tr ng-repeat="u in urls"><td></td><td><a href="#" ng-click="setUrl(u.url);">{{u.name}}</a></td></tr>' +                                               
                        '<tr><td>Resolution</td><td><select ng-model="resolution" ng-options="r.id for r in resolutions"></select></td></tr>' +
                        '<tr><td>Clip (top,left,width,left)</td><td><input ng-model="rect" type="text"/></td></tr>' +
                        '<tr ng-repeat="c in clips"><td></td><td><a href="#" ng-click="setClip(c.name);">{{c.id}}</a></td></tr></table>' +  
					'</div><div class="panel">' +
                        '<pre json="jsonImage" pretty-json />' +
                        '<button name="capture" ng-click="captureweb()">Capture as IMAGE</button>' +
                        '<pre json="jsonPdf" pretty-json />' +
                        '<button name="capture" ng-click="capturewebpdf()">Capture as PDF</button>' +
                        '<img ng-show="json" ng-src="{{json.json}}" />' +
                        // '<a href="data:application/octet-stream;base64,{{json.json}}" download="filename.png">Download me</a>' +
                        '<div id="pdfDoc" ng-show="jsonpdf"></div>' +
                        // '<object id="pdfDoc" data="data:application/pdf;base64,{{jsonpdf.json}}" type="application/pdf" width="100%" height="600px"></object>' +
					'</div>',
				link : function(scope, element, attrs) {
                    scope.jsonImage = {json: {'info': 'below will your image displayed => click Capture as IMAGE button first'}};
                    scope.jsonPdf = {json: {'info': 'below will your pdf displayed => click Capture as PDF button first'}};                   
                    scope.resolutions = [
						{id: 'iPhone 3GS (420x480)', name:'420x480'},
						{id: 'Nokia N900 (800x480)', name:'800x480'},
						{id: 'iPhone 4s (960x640)', name:'960x640'},
						{id: 'Galaxy Notes (1280x800)', name:'1280x800'},
						{id: 'iPad 2 (1024x768)', name:'1024x768'},
						{id: 'Galaxy Tab 10,1 (1280x800)', name:'1280x800'},
						{id: 'Playbook (1024x600)', name:'1024x600'},
						{id: 'Galaxy Tab 8,9 (1280x800)', name:'1280x800'},
						{id: 'iPad 3 (2048x1536)', name:'2048x1536'},
						{id: 'Macbook Air (1440x900)', name:'1440x900'},
						{id: 'iMac (2560x1440)', name:'2560x1440'},
						{id: 'Macbook pro Retina (2880x1800)', name:'2880x1800'}
					  ];

					scope.clips = [						
						{id: '100,200,200,300', name:'100,200,200,300'},
						{id: '100,200,300,400', name:'100,200,300,400'},
						{id: '100,200,400,500', name:'100,200,400,500'}
					];  

					scope.urls = [					
						{url: 'http://www.vice.com/', name: 'www.vice.com/'},
						{url: 'http://www.nationalgeographic.fr/', name: 'www.nationalgeographic.fr'},
						{url: 'https://maps.google.com/maps/ms?f=q&hl=fr&geocode=&ie=UTF8&msa=0&msid=101908501337757093341.000443bee508411eb6e9a&ll=48.874383,2.372553&spn=0.008581,0.020084&iwloc=00044e3190ebe22c0b86c&source=embed', name: 'gmap example'},
						{url: 'http://rue89.nouvelobs.com/', name: 'rue89.nouvelobs.com'}
					];            

					scope.resolution = scope.resolutions[0];  

                    var img = document.images[0];
					img.onclick = function() {
					    var url = img.src.replace(/^data:image\/png/, 'data:application/octet-stream');					    
					    location.href = url;
					};

					scope.setClip = function(clip) { scope.rect = clip; }
					scope.setUrl = function(url) { scope.url = url; }

					scope.captureweb = function() {
						var param = {
							url: scope.url, 
                     		mime: 'image/png', 
                     		viewportSize: { w: scope.resolution.name.split('x')[0], h: scope.resolution.name.split('x')[1] }
                     	};

                     	if (scope.rect)
                     		param.viewportRect = {
                     			top: scope.rect.split(',')[0], 
                     			left: scope.rect.split(',')[1],
                     			w: scope.rect.split(',')[2],
                     			h: scope.rect.split(',')[3]
                     		};

                     	ngProgress.start();

						captureweb.asyncCaptureWeb( param ).then(function(d) {
							scope.jsonpdf = undefined;
							scope.json = {json: 'data:image/png;base64,'+d.data};
							scope.jsonImage = {json: {'info': 'here we are !!!! click on it to download it'}};
							timeout(ngProgress.complete(), 1000);
						});
					};

					scope.capturewebpdf = function() {
						var param = {
							url: scope.url, 
                     		mime: 'application/pdf', 
                     		viewportSize: { w: scope.resolution.name.split('x')[0], h: scope.resolution.name.split('x')[1] }
                     	};

                     	if (scope.rect)
                     		param.viewportRect = {
                     			top: scope.rect.split(',')[0], 
                     			left: scope.rect.split(',')[1],
                     			w: scope.rect.split(',')[2],
                     			h: scope.rect.split(',')[3]
                     		};

                     	ngProgress.start();                     	

						captureweb.asyncCaptureWebPdf( param ).then(function(d) {
							scope.json = undefined;
							scope.jsonpdf = {json: d.data};	
							$('#pdfDoc').html('<object id="pdfDoc" data="data:application/pdf;base64,'+scope.jsonpdf.json+'" type="application/pdf" width="100%" height="600px"></object>');			
							scope.jsonImage = {json: {'info': 'here we are !!!! you can save it '}};
							timeout(ngProgress.complete(), 1000);
						});
					};					
		
				}
			};
		}]);
})(angular);