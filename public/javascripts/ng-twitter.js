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
					tweet.height = 200;
					angular.forEach(tweet.entities.urls, function(entry,i) {
						index_map[entry.indices[0]] = [entry.indices[1], function(text) {return "<a href='"+escapeHTML(entry.url)+"' class='link' target='_blank'>"+escapeHTML(entry.display_url)+"</a>";}];
					});
					angular.forEach(tweet.entities.hashtags, function(entry,i) {
						index_map[entry.indices[0]] = [entry.indices[1], function(text) {return "<a href='http://twitter.com/search?q=%23"+escapeHTML(entry.text)+"' class='hash' target='_blank'>"+escapeHTML(text)+"</a>";}];
					});
					angular.forEach(tweet.entities.user_mentions, function(entry,i) {
						index_map[entry.indices[0]] = [entry.indices[1], function(text) {return "<a title='"+escapeHTML(entry.name)+"' href='http://twitter.com/"+escapeHTML(entry.screen_name)+"' class='mention' target='_blank'>"+escapeHTML(text)+"</a>";}];
					});
					var img = '';
					angular.forEach(tweet.entities.media || [], function(entry, i) {
						tweet.height = entry.sizes.large.h;						
						tweet.width = entry.sizes.large.w;
						tweet.hasimg = true;
						img = "<a href='" + tweet.entities.media[0].expanded_url + "' target='_blank'><img class='img-rounded img-responsive' style='max-height:300px;margin-top: 5px;' src='" + escapeHTML(entry.media_url_https || entry.media_url)+"' width='"+tweet.width+"' height='"+tweet.height+"'></img></a>";
        				index_map[entry.indices[0]] = [entry.indices[1], function(text) {return img}];
    				});

					var result = !onlyimages ? '<table><tbody><tr><td>' : '';					
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
						
						result += '<span class="hidden-xs info" ng-show="!onlyimages">' +							
							'<a title="Go to twitter page" class="user" href="http://twitter.com/'+tweet.user.screen_name+'" target="_blank">'+tweet.user.screen_name+'</a>'+ 
							'<span title="Retweet Count" class="retweet">'+tweet.retweet_count+'</span>' + 
						'</span>';
					}
					else {
						result = tweet.hasimg ? '<table><tbody><tr><td>' + img + '</td></tr></tbody></table>' : '';
					}	

					if (!onlyimages)
						result += '</td></tr></tbody></table>';				

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
        // MATCH SCORES
		.service('scores', ['$http', function (http) {			
			return {
				asyncSearch: function(codeteam, codeawayteam) {	
					var cfg = {};									
					var queryUrl = '/queryworldcupscore?codeteam='+codeteam+'&codeawayteam='+codeawayteam;
					var promise = http.get(queryUrl, cfg).then(function (response) {
						return response;
					});
					return promise;
				}
			};
        }])
		// DIRECTIVE
		.directive('tweets', ['$timeout', '$interval', '$rootScope', '$location', '$compile', 'twitter', 'scores', 'linkify', function(timeout, interval, rootScope, location, compile, twitter, scores, linkify) {
			return {
				restrict : 'AE',
				scope: { key:'=', hashtag: '=', refresh:'@', button:'@', hash:'@', count:'@'},			
				template:
					'<div><div ng-if="!onlyimages">'+
						'<div data-ux-datagrid="tweets" class="datagrid" data-addons="overrides, listLoader, iScrollAddon, disableHoverWhileScrolling" data-options="{scrollModel:{manual:false}}">'+
						// '<div data-ux-datagrid="tweets" class="datagrid" data-addons="overrides, statsModel, gridLogger" data-options="{debug:{all:1, Flow:0}}">'+
							 
							 '<script type="template/html" template-name="default" template-item="tweet">'+						 	
							 	'<div class="tweet" ng-bind-html="tweet.html" style="height: 80px;"></div>'+						 					       
						     '</script>'+
						     '<script type="template/html" template-name="image" template-item="tweet">'+						 	
							 	'<div class="tweet" ng-bind-html="tweet.html" style="height:400px;"></div>'+											       
						     '</script>'+
						     
						'</div>'+
					'</div>'+
					'<div ng-if="onlyimages">'+

						'<div data-ux-datagrid="tweets" class="datagrid data-addons="listLoader, iScrollAddon, disableHoverWhileScrolling" data-options="{scrollModel:{manual:false}}">'+						
							 							 
						     '<script type="template/html" template-name="default" template-item="tweet">'+						 	
							 	'<div class="tweet" ng-bind-html="tweet.html" style="height:330px;"></div>'+											       
						     '</script>'+
						     
						'</div>'+
						// '<div ng-repeat="tweet in tweets" class="tweet" ng-if="tweet.hasimg" ng-bind-html="prettyDisplay(tweet)" || (tweet.entities.media && tweet.entities.media[0])"></div>'+
					'</div></div>'	
					,	
					// OLD ONE				
					// '<div ng-repeat="tweet in tweets track by tweet.id" class="tweet" ng-bind-html="prettyDisplay(tweet)" ng-if="!onlyimages || (tweet.entities.media && tweet.entities.media[0])"></div>',

				link : function(scope, elt, attrs) {

					scope.matchs = [
						{id: "WorldCup #tweets", value: "#worldcup", route: "worldcup" },
						{id: "22/06 - South Korea vs Algeria", value: "#KORvsALG OR #KORvALG OR #KORALG", route: "KORvsALG_2206", codeteam:'KOR',  codeawayteam:'ALG'},
				        {id: "22/06 - Belgium vs Russia", value: "#BELvsRUS OR #BELvRUS OR #BELRUS", route: "BELvsRUS_2206", codeteam:'BEL',  codeawayteam:'RUS'},
				        {id: "22/06 - Nigeria vs Bosnia", value: "#NIGvsBOS OR NIGvBOS OR NIGBOS", route: "NIGvsBOS_2206", codeteam:'NIG',  codeawayteam:'BIH'},
						{id: "21/06 - Germany vs Ghana", value: "#GERvsGHA OR #GERvGHA OR #GERGHA", route: "GERvsGHA_2106", codeteam:'GER',  codeawayteam:'GHA'},
				        {id: "21/06 - Argentina vs Iran", value: "#ARGvsIRA OR #ARGvIRA OR #ARGIRA", route: "ARGvsIRA_2106", codeteam:'ARG',  codeawayteam:'IRN'},
				        {id: "21/06 - Hondura vs Equator", value: "#HONvsECU OR HONvECU OR HONECU", route: "HONvsECU_2106", codeteam:'HON',  codeawayteam:'ECU'},
						{id: "20/06 - Switzerland vs France", value: "#SWIvsFRA OR #SWIvFRA OR #SWIFRA", route: "SWIvsFRA_2006", codeteam:'SUI',  codeawayteam:'FRA'},
			            {id: "20/06 - Italy vs Costa Rica", value: "#ITAvsCRC OR #ITAvCRC OR #ITACRC", route: "ITAvsCRC_2006", codeteam:'ITA',  codeawayteam:'CRC'},
				        {id: "20/06 - Japan vs Greek", value: "#JPNvsGRE OR JPNvGRE OR JPNGRE", route: "JPNvsGRE_2006", codeteam:'JPN',  codeawayteam:'GRE'},
						{id: "19/06 - Uruguay vs England", value: "#URUvsENG OR #URUvENG OR #URUENG", route: "URUvsENG_1906", codeteam:'URU',  codeawayteam:'ENG'},
			            {id: "19/06 - Columbia vs Ivoiry", value: "#COLvsCIV OR #COLvCIV OR #COLCIV", route: "COLvsCIV_1906", codeteam:'COL',  codeawayteam:'CIV'},
			            {id: "19/06 - Cameroon vs Crotia", value: "#CMRvsCRO OR CMRvCRO OR CMRCRO", route: "CMRvsCRO_1906", codeteam:'CMR',  codeawayteam:'CRO'},            
                       	{id: "18/06 - Spain vs Chili", value: "#SPAvsCHI OR #SPAvCHI OR #SPACHI", route: "SPAvsCHI_1806", codeteam:'ESP',  codeawayteam:'CHI'},
			            {id: "18/06 - Australia vs Netherland", value: "#AUSvsNED OR #AUSvNED OR #AUSNED", route: "AUSvsNED_1806", codeteam:'AUS',  codeawayteam:'NED'},
			            {id: "18/06 - Russia vs South Korea", value: "#RUSvsKOR OR RUSvKOR OR RUSKOR", route: "RUSvsKOR_1806", codeteam:'RUS',  codeawayteam:'KOR'},
			            {id: "17/06 - Brazil vs Mexico", value: "#BRAvsMEX OR #BRAvMEX OR #BRAMEX", route: "BRAvsMEX_1706", codeteam:'BRA',  codeawayteam:'MEX'},
			            {id: "17/06 - Belgium vs Algeria", value: "#BELvsALG OR #BELvALG OR #BELALG", route: "BELvsALG_1706", codeteam:'BEL',  codeawayteam:'ALG'},
			            {id: "17/06 - Ghana vs USA", value: "#GHAvsUSA OR #GHAvUSA OR #GHAUSA", route: "GHAvsUSA_1706", codeteam:'GHA',  codeawayteam:'USA'},
			            {id: "16/06 - Iran vs Nigeria", value: "#IRAvsNIG OR #IRAvNIG OR #IRANIG", route: "IRAvsNIG_1606", codeteam:'IRN',  codeawayteam:'NGA'},
			            {id: "16/06 - Germany vs Portugal", value: "#GERvsPOR OR #GERvPOR OR #GERPOR", route: "GERvsPOR_1606", codeteam:'GER',  codeawayteam:'POR'},
			            {id: "16/06 - Argentina vs Bosnia", value: "#ARGvsBOS OR #ARGvBOS OR #ARGBOS", route: "ARGvsBOS_1606", codeteam:'ARG',  codeawayteam:'BIH'},
			            {id: "15/06 - France vs Hondura", value: "#FRAvsHON OR #FRAvHON OR #FRAHON", route: "FRAvsHON_1506", codeteam:'FRA',  codeawayteam:'HON'},
			            {id: "15/06 - Switzerland vs Equator", value: "#SWIECU OR #SWIvsECU OR #SWIvECU", route: "SWIvsECU_1506", codeteam:'SUI',  codeawayteam:'ECU'},
			            {id: "15/06 - Ivoiry vs Japan", value: "#CIVJPN OR #CIVvsJPN OR #CIVvJPN", route: "CIVvsJPN_1506", codeteam:'CIV',  codeawayteam:'JPN'},
			            {id: "15/06 - England vs Italy", value: "#ENGvsITA OR #ENGvITA OR #ENGITA", route: "ENGvsITA_1506", codeteam:'ENG',  codeawayteam:'ITA'},
			            {id: "14/06 - Uruguay vs Costa Rica", value: "#URUvsCRC OR #URUvCRC OR #URUCRC", route: "URUvsCRC_1406", codeteam:'URU',  codeawayteam:'CRC'},
			            {id: "14/06 - Columbia vs Greeek", value: "#COLvsGRE OR #COLvGRE OR #COLGRE", route: "COLvsGRE_1406", codeteam:'COL',  codeawayteam:'GRE'},
			            {id: "14/06 - Chili vs Australia", value: "#CHIvsAUS OR #CHIvAUS OR #CHIAUX", route: "CHIvsAUS_1406", codeteam:'CHI',  codeawayteam:'AUS'},
			            {id: "13/06 - Spain vs Netherland", value: "#SPAvsNED OR #SPAvNED OR #SPANED", route: "SPAvsNED_1306", codeteam:'ESP',  codeawayteam:'NED'},
			            {id: "13/06 - Mexique vs Cameroon", value: "#MEXvsCMR OR #MEXvCMR OR #MEXCMR", route: "MEXvsCMR_1306", codeteam:'MEX',  codeawayteam:'CMR'},
			            {id: "12/06 - Brasil vs Crotia", value: "#BRAvsCRO OR #BRAvCRO OR #BRACRO", route: "BRAvsCRO_1206", codeteam:'BRA',  codeawayteam:'CRO'}
					];								

					var service = twitter;
					var since_id;
					var init = false;
					var bearer;
					var refresh = scope.refresh ? scope.refresh : 60;
					var count = scope.count ? parseInt(scope.count, 10) : undefined;
					var newerFirst = false;
					scope.RT = false;
					scope.counter = refresh;
					scope.stop = false;
					scope.tweets = [];
					scope.tweetIDs = {};
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
							}
						});

					};

					scope.popTweets = [];					

					var popit = function() {
						var newOnes = [];
						var i = 0;
						var l = scope.first ? 15 : 30;						
						if (scope.popTweets.length / l >= 1) {
							while (i < l) {
								var elt = scope.popTweets.pop();
								elt.html = scope.prettyDisplay(elt);										
								if (scope.onlyimages && elt.hasimg)
									newOnes.push(elt);			
								// else if (scope.onlyimages && !elt.hasimg)
								// 	popTweets.push(elt);				
								else if (elt && !scope.onlyimages)
									newOnes.push(elt);								
								i++;
							}
						}

						var test = scope.onlyimages ? true : newOnes.length == l;
						if (newOnes.length > 0 && test) {
							var old = scope.tweets;
							var newOne = old.concat(newOnes);
							scope.tweets = newOne;							
						}
							
					}

					//var a = setInterval(popit, 3000);
					var timeoutSearch = interval(popit, 8000);
					scope.first = true;

					scope.search = function() {
						var query = scope.hashtag.value || scope.hashtag;

						var result = {};	

						$('.loader').show();					

						service.asyncSearch(query, since_id).then(function(d) {
							scope.counter = refresh;
							if (d.data.errors)
							{
								//console.log(d.data.errors[0]);
								return;
							}								
							if (d && d.data && d.data.statuses) {
								if (scope.tweets.length > count) {
									scope.tweets = [];
								}

								var newTweets = d.data.statuses;
								var concatTweets = [];
								var skipping = 0;
								for (var i = 0;i<newTweets.length;i++) {
									var newTweet = newTweets[i];
									scope.RT = true; //!newTweet.retweeted && !scope.tweetIDs[newTweet.id];
									if (scope.RT) {
										// scope.tweetIDs[newTweet.id] = true;																	
										
										
										concatTweets.push(newTweet);
									}
									else {
										skipping++;
									}
								}

								scope.popTweets = newerFirst ? concatTweets.concat(scope.popTweets) : scope.popTweets.concat(concatTweets);
								//scope.tweets = newerFirst ? concatTweets.concat(scope.tweets) : scope.tweets.concat(concatTweets);

								if (scope.first) {
									popit();
									scope.first = false;									
								}

								scope.length = scope.tweets.length;

								result.count = scope.length;
								result.skipping = skipping;

								scope.$emit('searchResult', result);							
																	
								//since_id = d.data.search_metadata.since_id;
							}							
						});
					};						

					// $("#scroller").hover(function(){
			  //           if (scope.scrollInterval) {							
					// 		interval.cancel(scope.scrollInterval);
					// 		scope.scrollInterval = null;							
					// 		$("html, body").stop(true);
					// 	}
			  //       }, function(){
			  //           //tweenToNewSpeed(controller.fullSpeed);
			  //       });								

					scope.scrollTop = function() {						
						$("html, body").animate({ scrollTop: 0 });													 				 
					};

					scope.scrollBottom = function() {						
						$("html, body").animate({ scrollTop: $(document).height() });													 				 
					};

					scope.prettyDisplay = function(tweet) {
						return linkify.linkify_entities(tweet, scope.onlyimages);
					};

					scope.images = function(active) {						
						scope.onlyimages = active;
					};					

					scope.$on('search', function(e, msg) {
						scope.search();					
					});

					scope.$on('images', function(e, msg) {
						timeout(function() {
							scope.tweets = [];	
							scope.popTweets = [];			     					
				      		scope.first = true;
							scope.images(msg.active);
							// scope.onlyImages = msg.active;
							// //var el = angular.element(elt.html());							
							// var compiled = compile(elt);
							// //elt.html(el);
							// compiled(scope);							
						});						
					});

					scope.$on('scroll', function(e, msg) {
						scope.scroll();
					});

					var fetchScoreTimeout = function() {  

						scores.asyncSearch(scope.hashtag.codeteam, scope.hashtag.codeawayteam).then(function(d) {
							if (d && d.data && d.data.away_team >= 0 && d.data.home_team >= 0 ) {
								var result = {};

								result.home_team = d.data.home_team;
								result.away_team = d.data.away_team;
								result.status = d.data.status;

								scope.$emit('scoreResult', result);										
							}							
						}, function(err) {
							console.log(err);
						});	          			         			          
			        };		

					var scoretimeout = interval(fetchScoreTimeout, 8000);					

					scope.resetTweets = function() {						
						location.path('/worldcup/'+scope.hashtag.route);
					};
					
				    rootScope.$on( "$locationChangeSuccess", function(event, next, current) {

				    	scope.tweets = [];
				    	scope.popTweets = [];
				     						
				      	var currentPath = location.path();				      	
				      	scope.first = true;

				      	scope.hashtag = scope.matchs[0];

				      	for (var i = 0; i<scope.matchs.length;i++) {
				      		var match = scope.matchs[i];
				      		if ('/worldcup/' + match.route === currentPath) {				      			
				      			scope.tweetIDs = {};				      			
				      			scope.hashtag = match;				      			
				      		}				      		
				      	}
				      	
				      	scope.$emit('newRoute', scope.hashtag);


				      });


					scope.init();
				}
			};
		}]);
})(angular);