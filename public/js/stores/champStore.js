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
var _moveVector = [0, 0];

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

function getTilePosition() {
  for (var i = 0; i < _champs.length; i++) {

    var objectPosition = $('.' + Object.keys(_champs[i]).toString()).position();

    _champs[i][Object.keys(_champs[i])].position = [objectPosition.top, objectPosition.left];

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

function startChampAnimationLoop() {
  setInterval(function () {
    if (_animationCounter == 3) _animationCounter = 0;

    $('.champ-spirit').attr("id", "champ-" + _champs[0].champ.faceDirection + "-" + _animationCounter.toString());

    _animationCounter += 1;
  }, 250);
}

function setChampFaceDirection(keyCode) {
  _moveVector = [0, 0];

  switch(keyCode) {
    case 119:
      _champs[0].champ.faceDirection = "up";
      _moveVector[0] = -1;
      return "up";
      break;

    case 115:
      _champs[0].champ.faceDirection = "down";
      _moveVector[0] = 1;
      return "down";
      break;

    case 97:
      _champs[0].champ.faceDirection = "left";
      _moveVector[1] = -1;
      return "left";
      break;

    case 100:
      _champs[0].champ.faceDirection = "right";
      _moveVector[1] = 1;
      return "right";
      break;

    default:
      return "down";
      break;
  }
}

function canMoveTo(intendedTile) {
  var canMove = true;

  //handle board boarder
  if (intendedTile[0] > 7 ||
      intendedTile[0] < 0 ||
      intendedTile[1] > 7 ||
      intendedTile[1] < 0) {

    canMove = false;

  } else {

    //handle object
    if (LevelStore.getTileObject(intendedTile) != 0) {
      canMove = false;
    }

  }

  return canMove;
}

function updateChampTile(currentTile, intendedTile) {

  _champs[0].champ.tile = intendedTile;

  LevelStore.moveTile(currentTile, intendedTile, Object.keys(_champs[0]).toString());

}

function getIntendedTile(currentTile, faceDirection) {

  var intendedTile = ce.clone(currentTile);

  switch(faceDirection) {
    case "up":
      intendedTile[0] -= 1;
      break;

    case "down":
      intendedTile[0] += 1;
      break;

    case "left":
      intendedTile[1] -= 1;
      break;

    case "right":
      intendedTile[1] += 1;
      break;

    default:
      break;
  }

  return intendedTile;
}

function moveChamp(keyCode) {

  var faceDirection = setChampFaceDirection(keyCode);
  var currentTile = _champs[0].champ.tile;
  var intendedTile = getIntendedTile(currentTile, faceDirection);

  if(canMoveTo(intendedTile)) {

    //actually move our champ
    $('.champ-block').animate({
      top : "+=" + (_moveVector[0] * _tileWidth).toString(),
      left: "+=" + (_moveVector[1] * _tileWidth).toString()
    }, 1000);

    //update champ tile after animation
    setTimeout(function() {
      updateChampTile(currentTile, intendedTile);
    }, 1000);
  }
}

// function getChampHP() {
//   return _champHP;
// }

function champAttack() {
  var affectedTile = ce.clone(_champs[0].champ.tile);

  switch(_champs[0].champ.faceDirection) {
    case "up":
      affectedTile[0] -= 1;
      break;

    case "down":
      affectedTile[0] += 1;
      break;

    case "left":
      affectedTile[1] -= 1;
      break;

    case "right":
      affectedTile[1] += 1;
      break;

    default:
      break;
  }

  var canAttack = LevelStore.attackTile(affectedTile);

  var attackPosition = getAttackPosition();

  $('.champ-block').after("<img class='fire-ball' src='../img/fire_ball.png' height='20' width='20'>");

  $('.fire-ball').css({top: (attackPosition[0] + 5), left: (attackPosition[1] + 5)});

  setTimeout(function() {
    $('.fire-ball').remove();
  }, 750);

  if(canAttack) {
    CreepStore.settleDamage(LevelStore.getTileObject(affectedTile), 1);
  }
}

function getAttackPosition() {
  var attackPosition = [
    $('.champ-block').position().top,
    $('.champ-block').position().left
  ];

  switch(_champs[0].champ.faceDirection) {
    case "up":
      attackPosition[0] -= _tileWidth;
      break;

    case "down":
      attackPosition[0] += _tileWidth;
      break;

    case "left":
      attackPosition[1] -= _tileWidth;
      break;

    case "right":
      attackPosition[1] += _tileWidth;
      break;

    default:
      break;
  }

  return attackPosition;
}

function handleKeyPress(keyCode) {

  if (_canHandleNextKeyPress) {

    if (keyCode == 119 ||
        keyCode == 115 ||
        keyCode == 97 ||
        keyCode == 100) {
      moveChamp(keyCode);
    } else if (keyCode == 106) {
      champAttack();
    }

    //set key press cool down to 1 second
    _canHandleNextKeyPress = false;

    setTimeout(function() {
      _canHandleNextKeyPress = true;
    }, 1000);
  }

}

var ChampStore = assign({}, EventEmitter.prototype, {

  initiateChamp: initiateChamp,

  getChamp: getChamp,

  getTilePosition: getTilePosition,

  // getChampPosition: function() {
  //   loadChampTile();
  //   loadChampPosition();
  //   return _champPosition;
  // },

  startChampAnimationLoop: startChampAnimationLoop,

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
  var action = payload.action;
  
  switch(action.actionType) {
    case GameConstants.HANDLE_KEY_PRESS:
      keyCode = action.keyCode;
      handleKeyPress(keyCode);
      ChampStore.emitChange();
      break;

    default:
      return true;
  }

  return true;
});

module.exports = ChampStore;
