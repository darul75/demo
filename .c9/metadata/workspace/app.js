{"filter":false,"title":"app.js","tooltip":"/app.js","undoManager":{"mark":16,"position":16,"stack":[[{"group":"doc","deltas":[{"start":{"row":33,"column":4},"end":{"row":33,"column":5},"action":"remove","lines":["t"]},{"start":{"row":33,"column":4},"end":{"row":33,"column":13},"action":"insert","lines":["featuresT"]},{"start":{"row":33,"column":24},"end":{"row":34,"column":42},"action":"remove","lines":["","var outputFile = __dirname+'/tweets.json';"]},{"start":{"row":51,"column":2},"end":{"row":56,"column":3},"action":"remove","lines":["if (tweets.length === 100000000) {","    tweets = [];","    app.set(\"tweetJSON\", JSON.stringify({result:'nok'}));","  }","","  t"]},{"start":{"row":51,"column":2},"end":{"row":51,"column":11},"action":"insert","lines":["featuresT"]},{"start":{"row":53,"column":6},"end":{"row":53,"column":7},"action":"remove","lines":["t"]},{"start":{"row":53,"column":6},"end":{"row":53,"column":15},"action":"insert","lines":["featuresT"]},{"start":{"row":53,"column":30},"end":{"row":53,"column":31},"action":"remove","lines":["6"]},{"start":{"row":53,"column":30},"end":{"row":53,"column":32},"action":"insert","lines":["10"]},{"start":{"row":53,"column":43},"end":{"row":55,"column":0},"action":"remove","lines":["","",""]},{"start":{"row":53,"column":47},"end":{"row":64,"column":0},"action":"remove","lines":["  console.log(tweets.length);","","      createTopologyTweets();","      ","      writeTweetsFile();","","    }","}","","function createTopologyTweets() {","    ",""]},{"start":{"row":53,"column":47},"end":{"row":55,"column":2},"action":"insert","lines":["","      outputFile = __dirname+'/public/tweets.json';","  "]},{"start":{"row":55,"column":20},"end":{"row":55,"column":21},"action":"remove","lines":[" "]},{"start":{"row":55,"column":47},"end":{"row":55,"column":48},"action":"remove","lines":["t"]},{"start":{"row":55,"column":47},"end":{"row":55,"column":56},"action":"insert","lines":["featuresT"]},{"start":{"row":56,"column":4},"end":{"row":57,"column":2},"action":"remove","lines":["","  "]},{"start":{"row":56,"column":61},"end":{"row":56,"column":62},"action":"remove","lines":["t"]},{"start":{"row":56,"column":61},"end":{"row":56,"column":70},"action":"insert","lines":["featuresT"]},{"start":{"row":57,"column":0},"end":{"row":57,"column":2},"action":"insert","lines":["  "]},{"start":{"row":61,"column":4},"end":{"row":61,"column":6},"action":"insert","lines":["  "]},{"start":{"row":62,"column":0},"end":{"row":62,"column":2},"action":"remove","lines":["  "]},{"start":{"row":62,"column":0},"end":{"row":63,"column":0},"action":"insert","lines":["",""]},{"start":{"row":63,"column":2},"end":{"row":64,"column":0},"action":"remove","lines":["",""]},{"start":{"row":63,"column":6},"end":{"row":63,"column":7},"action":"remove","lines":["t"]},{"start":{"row":63,"column":6},"end":{"row":63,"column":15},"action":"insert","lines":["featuresT"]},{"start":{"row":64,"column":0},"end":{"row":65,"column":0},"action":"insert","lines":["",""]},{"start":{"row":65,"column":4},"end":{"row":66,"column":0},"action":"remove","lines":["",""]},{"start":{"row":65,"column":4},"end":{"row":68,"column":2},"action":"insert","lines":["  //console.log(JSON.stringify(featuresTweets));","","      // var json = JSON.stringify(collection);","  "]},{"start":{"row":69,"column":0},"end":{"row":72,"column":0},"action":"remove","lines":["}","","function writeTweetsFile() {",""]},{"start":{"row":69,"column":0},"end":{"row":69,"column":2},"action":"insert","lines":["  "]},{"start":{"row":69,"column":5},"end":{"row":69,"column":8},"action":"insert","lines":[" //"]},{"start":{"row":69,"column":50},"end":{"row":69,"column":76},"action":"remove","lines":["weets), {encoding:'utf8'},"]},{"start":{"row":69,"column":50},"end":{"row":69,"column":60},"action":"insert","lines":["opology), "]},{"start":{"row":70,"column":6},"end":{"row":70,"column":8},"action":"insert","lines":["//"]},{"start":{"row":70,"column":11},"end":{"row":72,"column":12},"action":"insert","lines":["//console.log(writed);","      //   //fs.writeFileSync(outputFile, JSON.stringify(topology));","      // });"]},{"start":{"row":73,"column":5},"end":{"row":73,"column":7},"action":"remove","lines":[");"]},{"start":{"row":76,"column":49},"end":{"row":76,"column":84},"action":"remove","lines":[",futebol,fútbol,Fußball,футбол,サッカー"]},{"start":{"row":87,"column":13},"end":{"row":87,"column":21},"action":"remove","lines":["* */20 *"]},{"start":{"row":87,"column":13},"end":{"row":87,"column":21},"action":"insert","lines":["00 00 00"]},{"start":{"row":89,"column":4},"end":{"row":95,"column":14},"action":"remove","lines":["http.get(\"http://darul-demo.herokuapp.com/twitter\", function(res) {","        console.log(\"Got response: \" + res.statusCode);","    }).on('error', function(e) {","      console.log(\"Got error: \" + e.message);","    });","  },","  start: false"]},{"start":{"row":89,"column":4},"end":{"row":93,"column":33},"action":"insert","lines":["featuresTweets = [];","    app.set(\"tweetJSON\", JSON.stringify({result:'nok'}));","  },","  start: false,","  timeZone: \"America/Los_Angeles\""]},{"start":{"row":125,"column":0},"end":{"row":126,"column":0},"action":"insert","lines":["  app.use(express.favicon(__dirname + '/public/images/favicon.ico'));",""]},{"start":{"row":143,"column":10},"end":{"row":143,"column":23},"action":"remove","lines":["express-cache"]},{"start":{"row":143,"column":10},"end":{"row":147,"column":25},"action":"insert","lines":["worldcup/*', function(req, res){ ","    res.render('test');","});","","/*app.get('/partials/test"]},{"start":{"row":148,"column":16},"end":{"row":148,"column":18},"action":"remove","lines":["no"]},{"start":{"row":149,"column":3},"end":{"row":149,"column":5},"action":"insert","lines":["*/"]},{"start":{"row":151,"column":10},"end":{"row":151,"column":15},"action":"remove","lines":["audio"]},{"start":{"row":151,"column":10},"end":{"row":151,"column":23},"action":"insert","lines":["express-cache"]},{"start":{"row":152,"column":16},"end":{"row":152,"column":21},"action":"remove","lines":["audio"]},{"start":{"row":152,"column":16},"end":{"row":152,"column":31},"action":"insert","lines":["nopartials/test"]},{"start":{"row":187,"column":0},"end":{"row":187,"column":9},"action":"remove","lines":["app.set(\""]},{"start":{"row":187,"column":0},"end":{"row":187,"column":4},"action":"insert","lines":["var "]},{"start":{"row":187,"column":12},"end":{"row":187,"column":14},"action":"remove","lines":["\","]},{"start":{"row":187,"column":12},"end":{"row":187,"column":14},"action":"insert","lines":[" ="]},{"start":{"row":187,"column":17},"end":{"row":187,"column":18},"action":"remove","lines":[")"]},{"start":{"row":192,"column":0},"end":{"row":193,"column":0},"action":"remove","lines":["    var lastUrls = app.get('lastUrls');",""]},{"start":{"row":215,"column":0},"end":{"row":216,"column":0},"action":"insert","lines":["\tvar top10 = app.get(\"lastUrls\");",""]},{"start":{"row":218,"column":30},"end":{"row":218,"column":49},"action":"remove","lines":["app.get('lastUrls')"]},{"start":{"row":218,"column":30},"end":{"row":218,"column":35},"action":"insert","lines":["top10"]},{"start":{"row":264,"column":0},"end":{"row":264,"column":2},"action":"remove","lines":["  "]},{"start":{"row":267,"column":0},"end":{"row":325,"column":0},"action":"insert","lines":["app.get('/queryworldcupscore', function(req, res){ ","  var codeteam = req.query.codeteam;","  var codeawayteam = req.query.codeawayteam;","","  var opts = {","    hostname: 'worldcup.sfg.io',","    path: '/matches',","    method: 'GET',","    port: 80","  };","","  var output = '';","","  var req1 = http.request(opts, function(res) {","    res.setEncoding('utf8');    ","    res.on('data', function (chunk) { ","      output += chunk; });","    res.on('end', fetchScore);","  });","  req1.on('error', function(e) { ","    fetchScore(); ","  });      ","  req1.setTimeout(10000, function() { ","    fetchScore(); ","  });","  req1.end();","  ","  var fetchScore = function () {","    ","    var o = {};","","    try {","      var matchs = JSON.parse(output);","      for (var i=0;i<matchs.length;i++) {","        var match = matchs[i];","        o['status'] = match.status;","        if (match.home_team && match.home_team.code === codeteam && match.away_team && match.away_team.code === codeawayteam) {","          o['home_team'] = match.home_team.goals;","          o['away_team'] = match.away_team.goals;","          break;","        }","      }","","      res.json(o);","    }","","    catch(e) {","      console.log('error while fetching scores');","      res.json(o);","    }    ","    ","  };","","  //fetchScore(); ","  //res.json({});","  ","});","",""]},{"start":{"row":391,"column":31},"end":{"row":391,"column":32},"action":"remove","lines":["5"]},{"start":{"row":391,"column":31},"end":{"row":391,"column":32},"action":"insert","lines":["3"]},{"start":{"row":393,"column":2},"end":{"row":405,"column":2},"action":"remove","lines":["  var data = fs.readFileSync(outputFile, {encoding : 'utf8'})","    ","    if (!data || data === '')","        app.set(\"tweetJSON\", JSON.stringify({result:'nok'}));","    else {","        tweets = JSON.parse(data);","        if (tweets && tweets.length > 0) {","            createTopologyTweets();","        }","        else","            app.set(\"tweetJSON\", JSON.stringify({result:'nok'}));    ","    }","  "]},{"start":{"row":393,"column":2},"end":{"row":393,"column":55},"action":"insert","lines":["app.set(\"tweetJSON\", JSON.stringify({result:'nok'}));"]},{"start":{"row":396,"column":20},"end":{"row":397,"column":8},"action":"insert","lines":["","        "]}]}],[{"group":"doc","deltas":[{"start":{"row":141,"column":3},"end":{"row":142,"column":0},"action":"insert","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":142,"column":0},"end":{"row":143,"column":0},"action":"insert","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":143,"column":0},"end":{"row":145,"column":3},"action":"insert","lines":["app.get('/', function(req, res){ ","    res.render('test');","});"]}]}],[{"group":"doc","deltas":[{"start":{"row":143,"column":10},"end":{"row":143,"column":11},"action":"insert","lines":["w"]}]}],[{"group":"doc","deltas":[{"start":{"row":143,"column":11},"end":{"row":143,"column":12},"action":"insert","lines":["o"]}]}],[{"group":"doc","deltas":[{"start":{"row":143,"column":12},"end":{"row":143,"column":13},"action":"insert","lines":["r"]}]}],[{"group":"doc","deltas":[{"start":{"row":143,"column":13},"end":{"row":143,"column":14},"action":"insert","lines":["l"]}]}],[{"group":"doc","deltas":[{"start":{"row":143,"column":14},"end":{"row":143,"column":15},"action":"insert","lines":["d"]}]}],[{"group":"doc","deltas":[{"start":{"row":143,"column":15},"end":{"row":143,"column":16},"action":"insert","lines":["c"]}]}],[{"group":"doc","deltas":[{"start":{"row":143,"column":16},"end":{"row":143,"column":17},"action":"insert","lines":["u"]}]}],[{"group":"doc","deltas":[{"start":{"row":143,"column":17},"end":{"row":143,"column":18},"action":"insert","lines":["p"]}]}],[{"group":"doc","deltas":[{"start":{"row":144,"column":16},"end":{"row":144,"column":20},"action":"remove","lines":["test"]},{"start":{"row":144,"column":16},"end":{"row":144,"column":17},"action":"insert","lines":["w"]}]}],[{"group":"doc","deltas":[{"start":{"row":144,"column":17},"end":{"row":144,"column":18},"action":"insert","lines":["o"]}]}],[{"group":"doc","deltas":[{"start":{"row":144,"column":18},"end":{"row":144,"column":19},"action":"insert","lines":["r"]}]}],[{"group":"doc","deltas":[{"start":{"row":144,"column":16},"end":{"row":144,"column":19},"action":"remove","lines":["wor"]},{"start":{"row":144,"column":16},"end":{"row":144,"column":24},"action":"insert","lines":["worldcup"]}]}],[{"group":"doc","deltas":[{"start":{"row":148,"column":16},"end":{"row":148,"column":20},"action":"remove","lines":["test"]},{"start":{"row":148,"column":16},"end":{"row":148,"column":24},"action":"insert","lines":["worldcup"]}]}]]},"ace":{"folds":[],"customSyntax":"javascript","scrolltop":3078.5,"scrollleft":0,"selection":{"start":{"row":145,"column":3},"end":{"row":145,"column":3},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":{"row":218,"state":"start","mode":"ace/mode/javascript"}},"timestamp":1421348358170,"hash":"36835378eb094ef2973b552073d69d4dabfad3a6"}