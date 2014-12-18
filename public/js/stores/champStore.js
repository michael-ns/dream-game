var GameDispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var ce = require('cloneextend');
var GameConstants = require('../constants');
var assign = require('object-assign');
var $ = require('jquery');
var CHANGE_EVENT = 'change';

var LevelStore = require('./levelStore');
var CreepStore = require('./creepStore');

var _champs = [];
var _tileWidth = 50;
var _charWidth = 32;
var _animationCounter = 0;
var _canHandleNextKeyPress = true;

function initiateChamp(champObject) {
  _champs.push(champObject);
}

function getChamp(objectName) {
  
  for (var i = 0; i < _champs.length; i++) {

    if(Object.keys(_champs[i]).toString() == objectName) {
      return _champs[i][Object.keys(_champs[i]).toString()];
    }

  }

}



// function loadChampTile() {

//   if(_champTile === null) {
//     _champTile = MapStore.getChampInitialTile();
//   }
// }

// function loadChampPosition() {
//   if (_champPosition[0] == 0) {

//     _champPosition[0] = $('.player').position().top;
//     _champPosition[0] += (_tileWidth - _charWidth) * 0.5;

//     _champPosition[1] = $('.player').position().left;
//     _champPosition[1] += (_tileWidth - _charWidth) * 0.5;
//   }
// }

// function startChampAnimationLoop() {
//   setInterval(function () {
//     if (_animationCounter == 3) _animationCounter = 0;

//     $('.champ-spirit').attr("id", "champ-" + _champFaceDirection + "-" + _animationCounter.toString());

//     _animationCounter += 1;
//   }, 250);
// }

// function setChampFaceDirection(keyCode) {
//   switch(keyCode) {
//     case 119:
//       _champFaceDirection = "up";
//       break;

//     case 115:
//       _champFaceDirection = "down";
//       break;

//     case 97:
//       _champFaceDirection = "left";
//       break;

//     case 100:
//       _champFaceDirection = "right";
//       break;

//     default:
//       break;
//   }
// }

// function canMoveTo() {
//   var canMove = true;

//   var tileWillMoveTo = ce.clone(_champTile);

//   switch(_champFaceDirection) {
//     case "up":
//       tileWillMoveTo[0] -= 1;
//       break;

//     case "down":
//       tileWillMoveTo[0] += 1;
//       break;

//     case "left":
//       tileWillMoveTo[1] -= 1;
//       break;

//     case "right":
//       tileWillMoveTo[1] += 1;
//       break;

//     default:
//       break;
//   }

//   //handle board boarder
//   if (tileWillMoveTo[0] > 7 ||
//       tileWillMoveTo[0] < 0 ||
//       tileWillMoveTo[1] > 7 ||
//       tileWillMoveTo[1] < 0) {
//     canMove = false;
//   }

//   //handle object
//   if (MapStore.getTileObject(tileWillMoveTo) != 0) {
//     canMove = false;
//   }

//   return canMove;
// }

// function updateChampinTiles() {

//   switch(_champFaceDirection) {
//     case "up":
//       _champTile[0] -= 1;
//       break;

//     case "down":
//       _champTile[0] += 1;
//       break;

//     case "left":
//       _champTile[1] -= 1;
//       break;

//     case "right":
//       _champTile[1] += 1;
//       break;

//     default:
//       break;
//   }

// }

// function moveChamp(keyCode) {
//   setChampFaceDirection(keyCode);

//   if (canMoveTo()) {
//     var moveVector = [0, 0];

//     switch(_champFaceDirection) {
//       case "up":
//         moveVector[0] -= 1;
//         break;

//       case "down":
//         moveVector[0] += 1;
//         break;

//       case "left":
//         moveVector[1] -= 1;
//         break;

//       case "right":
//         moveVector[1] += 1;
//         break;

//       default:
//         break;
//     }

//     //actually move our champ
//     $('.champ-block').animate({
//       top : "+=" + (moveVector[0] * _tileWidth).toString(),
//       left: "+=" + (moveVector[1] * _tileWidth).toString()
//     }, 1000);

//     setTimeout(function() {
//       _champPosition[0] += (moveVector[0] * _tileWidth);
//       _champPosition[1] += (moveVector[1] * _tileWidth);
//     }, 1000);

//     //update champ tile coordinate
//     updateChampinTiles();

//   }
// }

// function getChampHP() {
//   return _champHP;
// }

// function champAttack() {
//   var affectedTile = []

//   switch(_champFaceDirection) {
//     case "up":
//       affectedTile.push(_champTile[0] - 1);
//       affectedTile.push(_champTile[1]);
//       break;

//     case "down":
//       affectedTile.push(_champTile[0] + 1);
//       affectedTile.push(_champTile[1]);
//       break;

//     case "left":
//       affectedTile.push(_champTile[0]);
//       affectedTile.push(_champTile[1] - 1);
//       break;

//     case "right":
//       affectedTile.push(_champTile[0]);
//       affectedTile.push(_champTile[1] + 1);
//       break;

//     default:
//       break;
//   }

//   var canAttack = MapStore.attackTile(affectedTile);

//   var attackPosition = getAttackPosition();

//   $('.champ-block').after("<img class='fire-ball' src='../img/fire_ball.png' height='20' width='20'>");

//   $('.fire-ball').css({top: (attackPosition[0] + 5), left: (attackPosition[1] + 5)});

//   setTimeout(function() {
//     $('.fire-ball').remove();
//   }, 750);

//   if (MapStore.getTileObject(affectedTile) == 2) {
//     CreepStore.takeDamage("two", 1);
//   }

//   if (MapStore.getTileObject(affectedTile) == 3) {
//     console.log('champ will attack three')
//     CreepStore.takeDamage("three", 1);
//   }

// }

// function getAttackPosition() {
//   var attackPosition = ce.clone(_champPosition);

//   switch(_champFaceDirection) {
//     case "up":
//       attackPosition[0] -= _tileWidth;
//       break;

//     case "down":
//       attackPosition[0] += _tileWidth;
//       break;

//     case "left":
//       attackPosition[1] -= _tileWidth;
//       break;

//     case "right":
//       attackPosition[1] += _tileWidth;
//       break;

//     default:
//       break;
//   }

//   return attackPosition;
// }

// function handleKeyPress(keyCode) {

//   if (_canHandleNextKeyPress) {

//     if (keyCode == 119 ||
//         keyCode == 115 ||
//         keyCode == 97 ||
//         keyCode == 100) {
//       moveChamp(keyCode);
//     } else if (keyCode == 106) {
//       champAttack();
//     }

//     _canHandleNextKeyPress = false;

//     setTimeout(function() {
//       _canHandleNextKeyPress = true;
//     }, 1000);
//   }

// }

var ChampStore = assign({}, EventEmitter.prototype, {

  initiateChamp: initiateChamp,

  getChamp: getChamp,

  // getChampPosition: function() {
  //   loadChampTile();
  //   loadChampPosition();
  //   return _champPosition;
  // },

  // startChampAnimationLoop: startChampAnimationLoop,

  // getChampHP: getChampHP,

  //not specific to this game
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register to handle all updates
GameDispatcher.register(function(payload) {
  // var action = payload.action;
  
  // switch(action.actionType) {
  //   case GameConstants.HANDLE_KEY_PRESS:
  //     keyCode = action.keyCode;
  //     handleKeyPress(keyCode);
  //     ChampStore.emitChange();
  //     break;

  //   default:
  //     return true;
  // }

  // return true;
});

module.exports = ChampStore;
