var GameDispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var GameConstants = require('../constants');
var assign = require('object-assign');
var $ = require('jquery');
var CHANGE_EVENT = 'change';

var MapStore = require('./mapStore');
var CreepStore = require('./creepStore');

var _champTile = null;
var _champPosition = [0, 0];
var _tileWidth = 50;
var _charWidth = 32;
var _animationCounter = 0;
var _champFaceDirection = "down";
var _champHP = 5;
var _canHandleNextKeyPress = true;

function loadChampTile() {

  if(_champTile === null) {
    _champTile = MapStore.getChampInitialTile();
  }
}

function loadChampPosition() {
  if (_champPosition[0] == 0) {

    _champPosition[0] = $('.player').position().top;
    _champPosition[0] += (_tileWidth - _charWidth) * 0.5;

    _champPosition[1] = $('.player').position().left;
    _champPosition[1] += (_tileWidth - _charWidth) * 0.5;
  }
}

function startChampAnimationLoop() {
  setInterval(function () {
    if (_animationCounter == 3) _animationCounter = 0;

    $('.champ-spirit').attr("id", "champ-" + _champFaceDirection + "-" + _animationCounter.toString());

    _animationCounter += 1;
  }, 250);
}

function setChampFaceDirection(keyCode) {
  switch(keyCode) {
    case 119:
      _champFaceDirection = "up";
      break;

    case 115:
      _champFaceDirection = "down";
      break;

    case 97:
      _champFaceDirection = "left";
      break;

    case 100:
      _champFaceDirection = "right";
      break;

    default:
      break;
  }
}

function canMoveTo() {
  var canMove = false;

  switch(_champFaceDirection) {
    case "up":
      if(_champTile[0] != 0) canMove = true;
      break;

    case "down":
      if(_champTile[0] != 7) canMove = true;
      break;

    case "left":
      if(_champTile[1] != 0) canMove = true;
      break;

    case "right":
      if(_champTile[1] != 7) canMove = true;
      break;

    default:
      break;
  }

  return canMove;
}

function updateChampinTiles() {

  switch(_champFaceDirection) {
    case "up":
      _champTile[0] -= 1;
      break;

    case "down":
      _champTile[0] += 1;
      break;

    case "left":
      _champTile[1] -= 1;
      break;

    case "right":
      _champTile[1] += 1;
      break;

    default:
      break;
  }

}

function champTakeDamage(damage) {
  _champHP -= damage;

  if(damage > 0) {
    CreepStore.kill();
  }
}

function moveChamp(keyCode) {
  setChampFaceDirection(keyCode);

  if (canMoveTo()) {
    var moveVector = [0, 0];

    switch(_champFaceDirection) {
      case "up":
        moveVector[0] -= 1;
        break;

      case "down":
        moveVector[0] += 1;
        break;

      case "left":
        moveVector[1] -= 1;
        break;

      case "right":
        moveVector[1] += 1;
        break;

      default:
        break;
    }

    //actually move our champ
    $('.champ-block').animate({
      top : "+=" + (moveVector[0] * _tileWidth).toString(),
      left: "+=" + (moveVector[1] * _tileWidth).toString()
    }, 1000);

    setTimeout(function() {
      _champPosition[0] += (moveVector[0] * _tileWidth);
      _champPosition[1] += (moveVector[1] * _tileWidth);
    }, 1000);

    //update champ tile coordinate
    updateChampinTiles();

    //handle potential collision with other objects on the game map
    champTakeDamage(MapStore.champCollisionHandler(_champTile));

  }
}

function getChampHP() {
  return _champHP;
}

function champAttack() {
  var affectedTile = []

  switch(_champFaceDirection) {
    case "up":
      affectedTile.push(_champTile[0] - 1);
      affectedTile.push(_champTile[1]);
      break;

    case "down":
      affectedTile.push(_champTile[0] + 1);
      affectedTile.push(_champTile[1]);
      break;

    case "left":
      affectedTile.push(_champTile[0]);
      affectedTile.push(_champTile[1] - 1);
      break;

    case "right":
      affectedTile.push(_champTile[0]);
      affectedTile.push(_champTile[1] + 1);
      break;

    default:
      break;
  }

  var canAttack = MapStore.attackTile(affectedTile);

  var attackPosition = getAttackPosition();

  $('.champ-block').after("<img class='fire-ball' src='../img/fire_ball.png' height='20' width='20'>");

  $('.fire-ball').css({top: (attackPosition[0] + 5), left: (attackPosition[1] + 5)});

  setTimeout(function() {
    $('.fire-ball').remove();
  }, 750);

  if(canAttack) CreepStore.takeDamage(1);
}

function getAttackPosition() {
  var attackPosition = $.extend(true, {}, _champPosition);

  switch(_champFaceDirection) {
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

    _canHandleNextKeyPress = false;

    setTimeout(function() {
      _canHandleNextKeyPress = true;
    }, 1000);
  }

}

var ChampStore = assign({}, EventEmitter.prototype, {
  getChampPosition: function() {
    loadChampTile();
    loadChampPosition();
    return _champPosition;
  },

  startChampAnimationLoop: startChampAnimationLoop,

  getChampHP: getChampHP,

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
