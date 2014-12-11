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

function loadChampTile() {

  if(_champTile === null) {
    _champTile = MapStore.getChampInitialTile();
  }
}

function loadChampPosition() {
  _champPosition[0] = $('.player').position().top;
  _champPosition[0] += (_tileWidth - _charWidth) * 0.5;

  _champPosition[1] = $('.player').position().left;
  _champPosition[1] += (_tileWidth - _charWidth) * 0.5;
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
        moveVector[1] -= 1;
        break;

      case "down":
        moveVector[1] += 1;
        break;

      case "left":
        moveVector[0] -= 1;
        break;

      case "right":
        moveVector[0] += 1;
        break;

      default:
        break;
    }

    //actually move our champ
    $('.champ-block').animate({
      left : "+=" + (moveVector[0] * _tileWidth).toString(),
      top: "+=" + (moveVector[1] * _tileWidth).toString()
    }, 1000);

    //update champ position
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
    case GameConstants.MOVE_CHAMP:
      keyCode = action.keyCode;
      moveChamp(keyCode);
      ChampStore.emitChange();
      break;

    case GameConstants.CHAMP_ATTACK:
      champAttack();
      ChampStore.emitChange();
    break;

    default:
      return true;
  }

  return true;
});

module.exports = ChampStore;
