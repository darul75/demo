var readline = require('./utils.js'),
      rl = readline('./mower.txt');



var Cardinals = {
  'N': {x:0, y:1},
  'E': {x:1, y:0},
  'W': {x:-1, y:0},
  'S': {x:0, y:-1}
};

var CARDINALS_STR = ['N','E','S','W'];

function Vector(x, y) {
  this.x = x;
  this.y = y;
}

function Mower(x, y, direction) {  
  this.position = new Vector(x,y);
  this.direction = direction;
  this.directionVector = Cardinals[direction];
}

Mower.prototype.handleCommand = function(instructions) {
  instructions.split('').forEach(function(flag) {
    switch (flag) {
      case 'G':
      case 'D':
        var currentPos = this.direction;
        this.prevDirection = CARDINALS_STR.indexOf(currentPos);
        var newIdx = this.prevDirection - 1 >= 0 ? this.prevDirection - 1 : CARDINALS_STR.length -1;
        if (flag === 'D'){
          newIdx = this.prevDirection + 1 > 3 ?  0 : this.prevDirection + 1;
        }
        this.direction = CARDINALS_STR[newIdx];
      break;    
      default:
        this.move();
      break;     
    }     
  }, this);  

  return {
    x:this.position.x,
    y:this.position.y,
    direction: this.direction
  }  
};

Mower.prototype.move = function() { 
  var CARD_RULE = Cardinals[this.direction];
  var limitX = (this.position.x + CARD_RULE.x * 1 <= area.x) && (this.position.x + CARD_RULE.x * 1 >= 0);
  var limitY = (this.position.y + CARD_RULE.y * 1 <= area.y) && (this.position.y + CARD_RULE.y * 1 >= 0);
  var newX = limitX ? this.position.x + CARD_RULE.x * 1 : this.position.x;
  var newY = limitY ? this.position.y + CARD_RULE.y * 1 : this.position.y;

  if (!limitX || !limitY) {
    this.direction = CARDINALS_STR[this.prevDirection];      
  }

  this.position.x = newX;
  this.position.y = newY;  
};

var area = new Vector(5,5); // limits

var moves = "GAGAGAGAA";
var moves2 = "AADAADADDA";

function Play() {    
  
  var m1 = new Mower(1,2, 'N');  
  var m2 = new Mower(3,3, 'E');  

  var previousPosition = undefined  

  console.log("***** vehic 1 *******")
  console.log(m1.handleCommand(moves));  

  console.log("***** vehic 2 *******")
  console.log(m2.handleCommand(moves));  
  
}

Play();

var line = 0;    
rl.on('line', function(line) {
  if (line === 0) {
    
  }  
})
.on('error', function(e) {
  // something went wrong
});
