(function (angular) {
'use strict';	

	angular.module('ngTwitter', ['ngSanitize'])	
		// TWEET LINKIFIER
		.service('linkify',['$sce', function(sce) {
 
			function escapeHTML(text) {
				return angular.element('<div/>').text(text).html();
			}
 
			return {
				linkify_entities: function(tweet, onlyimages) {
					if (!(tweet.entities)) {
						return escapeHTML(tweet.text);
					}
					// This is very naive, should find a better way to parse this
					var index_map = {};
					angular.forEach(tweet.entities.urls, function(entry,i) {
						index_map[entry.indices[0]] = [entry.indices[1], function(text) {return "<a href='"+escapeHTML(entry.url)+"' class='link' target='_blank'>"+escapeHTML(entry.display_url)+"</a>";}];
					});
					angular.forEach(tweet.entities.hashtags, function(entry,i) {
						index_map[entry.indices[0]] = [entry.indices[1], function(text) {return "<a href='http://twitter.com/search?q=%23"+escapeHTML(entry.text)+"' class='hash' target='_blank'>"+escapeHTML(text)+"</a>";}];
					});
					angular.forEach(tweet.entities.user_mentions, function(entry,i) {
						index_map[entry.indices[0]] = [entry.indices[1], function(text) {return "<a title='"+escapeHTML(entry.name)+"' href='http://twitter.com/"+escapeHTML(entry.screen_name)+"' class='mention' target='_blank'>"+escapeHTML(text)+"</a>";}];
					});
					var result = "";
					var last_i = 0;
					var i = 0;
					// iterate through the string looking for matches in the index_map
					if (!onlyimages) {
						for (i=0; i < tweet.text.length; ++i) {
							var ind = index_map[i];
							if (ind) {
								var end = ind[0];
								var func = ind[1];
								if (i > last_i) {
									result += escapeHTML(tweet.text.substring(last_i, i));
								}
								result += func(tweet.text.substring(i, end));
								i = end - 1;
								last_i = end;
							}
						}
						if (i > last_i) {
							result += escapeHTML(tweet.text.substring(last_i, i));
						}
					}

					if (tweet.entities.media && tweet.entities.media[0]) {
						result += '<div><a href="' + tweet.entities.media[0].expanded_url + '" target="_blank"><img src="' + tweet.entities.media[0].media_url + '" /></a></div>'; 
					}

					result += 
					'<span class="info" ng-show="!onlyimages">' +							
								'<a title="Go to twitter page" class="user" href="http://twitter.com/'+tweet.user.screen_name+'" target="_blank">'+tweet.user.screen_name+'</a>'+ 
								'<span title="Retweet Count" class="retweet">'+tweet.retweet_count+'</span>' + 
							'</span>';
					return sce.trustAsHtml(result);
				}
			};
		}])
		// TWEETER SERVICE AUTH AND QUERY
		.service('twitter', ['$http', function (http) {			
			return {
				asyncSearch: function(hashtag, since) {
					var cfg = {};
					var paramSince = since ? '&since_id='+ since : '';
					//var queryUrl = 'https://api.twitter.com/1.1/search/tweets.json?q=%23'+hashtag+paramSince;
					var queryUrl = '/search?hashtag='+encodeURIComponent(hashtag)+paramSince;
					var promise = http.get(queryUrl, cfg).then(function (response) {						
						return response;
					});
					return promise;
				}
			};
        }])
		// DIRECTIVE
		.directive('tweets', ['$timeout', '$interval', '$rootScope', '$location', 'twitter', 'linkify', function(timeout, interval, rootScope, location, twitter, linkify) {
			return {
				restrict : 'AE',
				scope: { key:'=', hashtag: '=', refresh:'@', button:'@', hash:'@', count:'@'},			
				template: 
					'<div class="panel" ng-show="button">' + 						
						'<div><button name="START" ng-click="startTimeout()" ng-show="stop">FETCH NEW TWEETS</button>' + 
						'<button name="STOP" ng-click="stopTimeout()" ng-show="!stop" class="active">STOP FETCHING TWEETS</button></div>' +
						'<div><button name="ONLYIMAGES" ng-click="onlyImages()" ng-show="!onlyimages">PICS ONLY</button>' +
						'<button name="EVERYTHING" ng-click="onlyImages()" ng-show="onlyimages" class="active">EVERYTHING</button></div>' +
						'<div><button name="SCROLL" ng-click="scroll()" ng-show="!scrollInterval">SCROLL AUTO</button>' +
						'<button name="STOPSCROLL" ng-click="scroll()" ng-show="scrollInterval" class="active">STOP SCROLLING AUTO</button></div>' +						
						'<div><button name="TOPSCROLL" ng-click="scrollTop()">SCROLL TOP</button></div>' +						
						'<div><button name="BOTTOMSCROLL" ng-click="scrollBottom()">SCROLL BOTTOM</button></div>' +						
						'<div style="color: #FFFFFF;">- refresh {{counter}}s - #tweets : {{length}}</div>' +
					'</div>' +				
					// '<div class="panel" ng-show="hash">' +						
						// '<input type="text" name="input" ng-model="hashtag">' +
					// '</div>' +
					'<div class="styled-select">SELECT MATCH HERE:</div>' +
					'<div class="styled-select"><select ng-model="hashtag" ng-options="r.id for r in matchs" ng-change="resetTweets()"></select></div>' +						
					'<ul class="tweetFavList">'+ 
						'<li ng-repeat="tweet in tweets">' +
							'<p class="tweet" ng-bind-html="prettyDisplay(tweet)" ng-if="!onlyimages || (tweet.entities.media && tweet.entities.media[0])"></p>' +							
					'</li></ul>',
				link : function(scope, element, attrs) {
					scope.matchs = [
						{id: "Worlcup, select MATCH HERE !!", value: "#worldcup", route: "worldcup" },
						{id: "12/06 - Brasil vs Crotia", value: "#BRAvsCRO OR #BRAvCRO OR #BRACRO", route: "BRAvsCRO_1206" },
						{id: "13/06 - Mexique vs Cameroun", value: "#MEXvsCMR OR #MEXvCMR OR #MEXCMR", route: "MEXvsCMR_1306" },
						{id: "13/06 - Spain vs Netherland", value: "#SPAvsNED OR #SPAvNED OR #SPANED", route: "SPAvsNED_1306" },
						{id: "14/06 - Chili vs Australia", value: "#CHIvsAUS OR #CHIvAUS OR #CHIAUX", route: "CHIvsAUS_1406" },
						{id: "14/06 - Columbia vs Greeek", value: "#COLvsGRE OR #COLvGRE OR #COLGRE", route: "COLvsGRE_1406" },
						{id: "14/06 - Uruguay vs Costa Rica", value: "#URUvsCRC OR #URUvCRC OR #URUCRC", route: "URUvsCRC_1406" },
						{id: "15/06 - England vs Italy", value: "#ENGvsITA OR #ENGvITA OR #ENGITA", route: "ENGvsITA_1506" },
						{id: "15/06 - Ivoiry vs Japan", value: "#CIVJPN OR #CIVvsJPN OR #CIVvJPN", route: "CIVvsJPN_1506" },
						{id: "15/06 - Switzerland vs Equator", value: "#SWIECU OR #SWIvsECU OR #SWIvECU", route: "SWIvsECU_1506" },
						{id: "15/06 - France vs Hondura", value: "#FRAvsHON OR #FRAvHON OR #FRAHON", route: "FRAvsHON_1506" },
						{id: "16/06 - Argentina vs Bosnia", value: "#ARGvsBOS OR #ARGvBOS OR #ARGBOS", route: "ARGvsBOS_1606" },
						{id: "16/06 - Germany vs Portugal", value: "#GERvsPOR OR #GERvPOR OR #GERPOR", route: "GERvsPOR_1606" },
						{id: "16/06 - Iran vs Nigeria", value: "#IRAvsNIG OR #IRAvNIG OR #IRANIG", route: "IRAvsNIG_1606" },

					];								

					var service = twitter;
					var since_id;
					var init = false;
					var bearer;
					var refresh = scope.refresh ? scope.refresh : 60;
					var count = scope.count ? parseInt(scope.count, 10) : undefined;
					scope.counter = refresh;
					scope.stop = false;
					scope.tweets = [];
					scope.onlyimages = false;

					var scroll = 0;					
					scope.scrollInterval = null;

					scope.hashtag = scope.matchs[0];

					scope.length = 0;

					if (!scope.key)
						return;				

					scope.init = function() {
						// HANDLE SERVER SIDE
						scope.search();
						
						// LOCAL MODE BUT CORS
						scope.$watch('hashtag', function(newValue, oldValue) {
							if ( newValue !== oldValue) {
								scope.search();
								//scope.scroll();								
							}
						});

					};

					scope.onTimeout = function() {						
						scope.search();
						mytimeout = timeout(scope.onTimeout,refresh*1000);
					};

					scope.onTimeoutCounter = function() {
						scope.counter--;						
						mytimeoutcounter = timeout(scope.onTimeoutCounter,1000);
					};

					var mytimeout = timeout(scope.onTimeout,refresh*1000);
					var mytimeoutcounter = timeout(scope.onTimeoutCounter,1000);

					scope.stopTimeout = function() {
						scope.counter = refresh;
						scope.stop = true;
						timeout.cancel(mytimeout);
						timeout.cancel(mytimeoutcounter);
					};

					scope.startTimeout = function() {
						scope.stop = false;
						mytimeout = timeout(scope.onTimeout,refresh*1000);
						mytimeoutcounter = timeout(scope.onTimeoutCounter,1000);
					};

					scope.search = function() {
						var query = scope.hashtag.value || scope.hashtag;

						service.asyncSearch(query, since_id).then(function(d) {
							scope.counter = refresh;
							if (d.data.errors)
							{
								//console.log(d.data.errors[0]);
								return;
							}								
							if (d && d.data && d.data.statuses) {
								if (scope.tweets.length < count) {
									scope.tweets = scope.tweets.concat(d.data.statuses);	
								}
								else {
									scope.tweets = scope.tweets.slice(count, scope.tweets.length);
									scope.tweets = scope.tweets.concat(d.data.statuses);		
								}		

								scope.length = scope.tweets.length;						
																	
								since_id = d.data.search_metadata.since_id;
							}							
						});
					};						

					$("#scroller").hover(function(){
			            if (scope.scrollInterval) {							
							interval.cancel(scope.scrollInterval);
							scope.scrollInterval = null;							
							$("html, body").stop(true);
						}
			        }, function(){
			            //tweenToNewSpeed(controller.fullSpeed);
			        });
				
					scope.scroll = function() {
						if (scope.scrollInterval) {							
							interval.cancel(scope.scrollInterval);
							scope.scrollInterval = null;							
							$("html, body").stop(true);
						}
						else {
							scroll = $(document).scrollTop();
						 	scope.scrollInterval = interval(function() {
								scroll += 800;
								var value = scroll+'px';
								$("html, body").animate({ scrollTop: value }, 200, function() {
									// $("html, body").unbind("scroll mousedown DOMMouseScroll mousewheel keyup");
									return false; 
								});
							}, 6000);				
					 	}					 
					};	

					scope.scrollTop = function() {						
						$("html, body").animate({ scrollTop: 0 });													 				 
					};

					scope.scrollBottom = function() {						
						$("html, body").animate({ scrollTop: $(document).height() });													 				 
					};

					scope.prettyDisplay = function(tweet) {
						return linkify.linkify_entities(tweet, scope.onlyimages);
					};

					scope.onlyImages = function() {
						scope.onlyimages = !scope.onlyimages;
					};

					scope.resetTweets = function() {						
						location.path('/worldcup/'+scope.hashtag.route);
					};

					
				    rootScope.$on( "$locationChangeSuccess", function(event, next, current) {
				     						
				      	var currentPath = location.path();

				      	for (var i = 0; i<scope.matchs.length;i++) {
				      		var match = scope.matchs[i];
				      		if ('/worldcup/' + match.route === currentPath) {
				      			scope.tweets = [];
				      			scope.hashtag = match;
				      		}
				      	}				      

				      });

					scope.init();
				}
			};
		}]);
})(angular);