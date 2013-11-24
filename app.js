// reference the http module so we can create a webserver
var http = require("http");
var path = require('path');
var twitter = require("./twitter.js");
var express = require('express');
var satelize = require('satelize');

//
var options = {authKey:'bzJZSlN4ZnJUYWhyeXdub2R4MzJBOkFHSmw5MnJIeEFTRkpYVW9BSm8zMEpTQzU2Wm0zNFZxZmFVZFh1TUZWamc='};

var init = false; 

var app = express();
//exports.app = app;

app.configure(function(){
  //app.set('port', process.env.PORT || 4000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view cache', true);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());  
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/', function(req, res){ 
    res.render('test');
});

app.get('/satelize', function(req, res){ 
    res.render('satelize');
});

app.get('/search', function(req, res){ 
	var hash = req.query.hashtag;
    twitter.query({hashtag:hash}, function(err, data) {
        res.writeHead(200, {"Content-Type": "application/json"});
        var json = JSON.stringify(data);
        res.end(json);
    });
});

app.get('/querysatelize', function(req, res){ 
	var ip = req.query.ip;
	console.log('ipserver'+ip);
	satelize.satelize({ip:ip}, function(err, geoData) {
      res.end(geoData);
    });
});

/*app.listen(8080, function(){*/
var port = process.env.PORT || 5000;
app.listen(port, function() {
	if (!init) {
        twitter.auth(options, function(err, data) {
          init=true;
        
        });
    }
});

// create a server
/*http.createServer(function(req, res) {
    // on every request, we'll output 'Hello world'
    res.end("Hello world from Cloud9!");
    
    console.log(req.url);
    
}).listen(process.env.PORT, process.env.IP);*/



// Note: when spawning a server on Cloud9 IDE, 
// listen on the process.env.PORT and process.env.IP environment variables

// Click the 'Run' button at the top to start your server,
// then click the URL that is emitted to the Output tab of the console