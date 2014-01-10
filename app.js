// reference the http module so we can create a webserver
var http = require("http");
var path = require('path');
var twitter = require("./twitter.js");
var express = require('express');
var satelize = require('satelize');
var starterAws = require('starter-aws');
var dynupdate = require('dynupdate');
var jcc = require('jade-cache');
var captureweb = require('captureweb');
var base64encode = require('base64-stream').Encode;
var fs = require('fs');
var xml2js = require('xml2js');
var agent007 = require('agent007');

var parser = new xml2js.Parser
var useragents = '';

// http://techpatterns.com/downloads/firefox/useragentswitcher.xml
fs.readFile(__dirname + '/useragentswitcher.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        useragents = result;
        console.log('useragents loaded');
    });
});

var init = false; 

var app = express();
//exports.app = app;

app.configure(function(){
  //app.set('port', process.env.PORT || 4000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  //app.set('view cache', true);
  app.use(jcc.handle); // activate middleware
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());  
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.static(path.join(__dirname, 'public')));
});

var options = {debug:true};

jcc.init(options, app, function() {
  // all is compiled
  //app.enable('jcc'); // mandatory for middleware to be activated
});

// starter

starterAws.daemon(function(err, o) {console.log(o)});

app.get('/', function(req, res){ 
    res.render('test');
});

/*app.get('/partials/test', function(req, res){ 
    res.render('partials/test');
});*/

app.get('/express-cache', function(req, res){ 
    res.render('nopartials/test');
});

app.get('/satelize', function(req, res){ 
    res.render('satelize');
});

app.get('/captureweb', function(req, res){ 
    res.render('captureweb');
});

app.get('/starter', function(req, res){ 
    res.render('starter');
});

app.get('/useragent', function(req, res){ 
    res.render('useragent');
});

app.get('/dynupdate', function(req, res){ 
    res.render('dynupdate');
});

app.post('/capturewebquery', function(req, res){ 
  var params = req.body;

    captureweb.capture(params, function(err, stream) {
         if (err) {          
          res.setHeader('Content-Type', 'text/html');
          res.write(err.toString());
          res.end();
          return;          
        }

        res.writeHead(200, {'Content-Type' : params.mime});

        stream.pipe(base64encode()).pipe(res);
    });
});

app.post('/capturewebquerypdf', function(req, res){ 
  var params = req.body;

    captureweb.capture(params, function(err, stream) {
         if (err) {          
          res.setHeader('Content-Type', 'text/html');
          res.write(err.toString());
          res.end();
          return;          
        }

        res.writeHead(200, {'Content-Type' : params.mime});

        stream.pipe(base64encode()).pipe(res);
    });
});

app.get('/search', function(req, res){ 
	var hash = req.query.hashtag;
    twitter.query({hashtag:hash}, function(err, data) {
        res.writeHead(200, {"Content-Type": "application/json"});
        var json = JSON.stringify(data);
        res.end(json);
    });
});

app.get('/useragentquery', function(req, res){ 
	var agent = req.query.agent;
	console.log('agent '+agent);
	res.end(JSON.stringify(agent007.findAgentsByType(agent)));
});

app.get('/useragenttypequery', function(req, res){
	res.end(JSON.stringify(agent007.getTypes()));
});

app.get('/querysatelize', function(req, res){ 
	var ip = req.query.ip;
	console.log('ip '+ip);
	satelize.satelize({ip:ip}, function(err, geoData) {
      res.end(geoData);
    });
});

app.get('/useragents', function(req, res){   
  res.json(useragents);
});

app.post('/querystarter', function(req, res){ 
	var options = req.body;

  starterAws.initCredentials(options);

	starterAws.starter(function(err, status) {
      if (err) {
          console.log(err);
          res.json({'error':err.toString()});
      }
      else    
          res.end(status);
    });
});

app.post('/querystarterdaemonstart', function(req, res){ 
  var options = req.body;

  starterAws.initCredentials(options);

  starterAws.daemon(function(err, states) {
      if (err) {
          console.log(err);
          res.json({'error':err.toString()});
      }
      else    
          res.json(states);
    });
});

app.post('/querystarterdaemonstop', function(req, res){ 
  var options = req.body;

  starterAws.initCredentials(options);

  starterAws.daemonStop();

  res.json({status:'ok'})
});

app.get('/querydynupdate', function(req, res){ 
    var domain = req.query.domain;
	var ip = req.query.ip;
	var auth = req.query.auth;
	console.log('domain '+domain);
	console.log('ip '+ip);
	console.log('auth '+auth);
	dynupdate.dynupdate({hostname:domain, auth:auth, myip:ip}, function(err, status) {
        if (err) {
            console.log(err);
            res.end(err.toString());
            return;
        }  
        res.end(status);
    });
});

app.get(function(req, res){ 
    console.log('toto');
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