// node http api
var http = require('http');
var OAuth = require('./node_modules/oauth/index.js');
var OAuth2 = OAuth.OAuth2;  

var twitterConsumerKey = 'o2YJSxfrTahrywnodx32A';
 var twitterConsumerSecret = 'AGJl92rHxASFJXUoAJo30JSC56Zm34VqfaUdXuMFVjg';
 var oauth2 = new OAuth2(
   twitterConsumerKey,
   twitterConsumerSecret, 
   'https://api.twitter.com/', 
   null,
   'oauth2/token', 
   null);

var bearer;

function Twitter() {
  this.init();
}

Twitter.prototype.init = function() {
  return this;
};

Twitter.prototype.auth = function(options, next) {
    oauth2.getOAuthAccessToken(
       '',
       {'grant_type':'client_credentials'},
       function (e, access_token, refresh_token, results){
         console.log('bearer: ',access_token);
         bearer = access_token;
         return next(e, access_token);
    });
    
  return this;
};

Twitter.prototype.query = function(options, next) {
    
  var paramSince = options.since ? '&since_id='+ options.since : '';
  var hash = encodeURIComponent(options.hashtag);
	var queryUrl = 'https://api.twitter.com/1.1/search/tweets.json?q='+hash+paramSince;	
	
	oauth2.useAuthorizationHeaderforGET(true);
	
    oauth2.get(queryUrl, bearer, function(e,data, response) {
         //console.log('e'+JSON.stringify(e));
         if (e) {
             //console.log('error');
             return next(e, null);
         }
         //console.log(res.statusCode);
         /*if (res.statusCode!=200) 
           return next(new Error(
             'OAuth2 request failed: '+
             res.statusCode),null);*/
         try {
            //console.log(data);
           data = JSON.parse(data);        
         }
         catch (e){
           return next(e, null);
         }
         return next(e, data);
      });
      
      //console.log('bearer' + bearer);
    
    return this;
};

var twitter = new Twitter();
module.exports = twitter;