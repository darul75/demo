/*

5 5
1 2 N
GAGAGAGAA
3 3 E
AADAADADDA

RESULT

1 3 N
5 1 E

*/

var N= {x:0, y:1};
var E= {x:1, y:0};
var W= {x:-1, y:0};
var S= {x:0, y:-1};

var CARDINALS = [N,E,S,W];
var CARDINALS_STR = ['N','E','S','W'];


var Vehicule = { x: 0, y : 0, o: N};
var Vehicule2 = { x: 0, y : 0, o: N};

var Area = { x: 0, y: 0}; // limits

var moves = "GAGAGAGAA";
var moves2 = "AADAADADDA";


var D = 'D'; // pivot right
var G = 'G'; // pivot left
var A = 'A'; // move


function Play() {
  console.log("play");

  var area = Area;
  area.x = 5;
  area.y = 5;

  var t1 = Vehicule;
  t1.x = 1;
  t1.y = 2;
  t1.o = 'N';

  var t2 = Vehicule2;
  t2.x = 3;
  t2.y = 3;
  t2.o = 'E';

  var previousPosition = undefined

  var setMove = function(vehicule, flag) {
    switch (flag) {
      case 'G':
        var currentPos = vehicule.o;
        previousPosition = CARDINALS_STR.indexOf(currentPos);
        var newIdx = previousPosition - 1 >= 0 ? previousPosition - 1 : CARDINALS_STR.length -1;        
        vehicule.o = CARDINALS_STR[newIdx];
        break;
      case 'D':
        var currentPos = vehicule.o;
        previousPosition = CARDINALS_STR.indexOf(currentPos);
        var newIdx = previousPosition + 1 > 3 ?  0 : previousPosition + 1;        
        vehicule.o = CARDINALS_STR[newIdx];
      break;
      default:
        doMove(vehicule);
      break;      
    }
  };

  var doMove = function(vehicule) {
    var CARD_RULE = CARDINALS[CARDINALS_STR.indexOf(vehicule.o)];
    var limitX = (vehicule.x + CARD_RULE.x * 1 <= area.x) && (vehicule.x + CARD_RULE.x * 1 >= 0);
    var limitY = (vehicule.y + CARD_RULE.y * 1 <= area.y) && (vehicule.y + CARD_RULE.y * 1 >= 0);
    var newX = limitX ? vehicule.x + CARD_RULE.x * 1 : vehicule.x;
    var newY = limitY ? vehicule.y + CARD_RULE.y * 1 : vehicule.y;

    if (!limitX || !limitY) {
      vehicule.o = CARDINALS_STR[previousPosition];      
    }

    vehicule.x = newX;
    vehicule.y = newY;

    console.log(vehicule.x + " " + vehicule.y + vehicule.o)
  };

  console.log("***** vehic 1 *******")
  for (var i = 0; i < moves.length; i++) {
    var move = moves[i];
    setMove(t1, move);
  }

  console.log("***** vehic 2 *******")
  for (var i = 0; i < moves2.length; i++) {
    var move = moves2[i];
    setMove(t2, move);
  }

 
}

Play();
