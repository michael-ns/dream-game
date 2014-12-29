var GameDispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var GameConstants = require('../constants');
var assign = require('object-assign');
var $ = require('jquery');
var CHANGE_EVENT = 'change';

var LevelStore = require('../stores/levelStore');
var LevelAcionCreators = require('../actions/levelActionCreators');

var _creeps = [];

var _tileWidth = 50;
var _charWidth = 32;
var _animationCounter = 0;

function turnOnAI() {
  for (var i = 0; i < _creeps.length; i++) {
    singleCreepAI(_creeps[i][Object.keys(_creeps[i]).toString()]);
  }

  LevelStore.nextTurn();
}

function singleCreepAI(creep) {
  //if the champ is around, turn to the champ and attack
  var ChampStore = require('../stores/champStore');
  var champTile = ChampStore.getTile();

  var verticalDistance = champTile[0] - creep.tile[0];
  var horizontalDistance = champTile[1] - creep.tile[1];

  

}

function initiateCreep(creepObject) {
  _creeps.push(creepObject);
}

function getCreep(objectName) {

  for (var i = 0; i < _creeps.length; i++) {

    if(Object.keys(_creeps[i]).toString() == objectName) {
      return _creeps[i][Object.keys(_creeps[i]).toString()];
    }

  }
}

function getTilePosition() {
  for (var i = 0; i < _creeps.length; i++) {

    var objectPosition = $('.' + Object.keys(_creeps[i]).toString()).position();

    _creeps[i][Object.keys(_creeps[i])].position = [objectPosition.top, objectPosition.left];
    
  }
}

function startCreepAnimationLoop() {
  setInterval(function () {
    if (_animationCounter == 3) _animationCounter = 0;

    $('.creep-spirit').attr("id", "creep-down-" + _animationCounter.toString());

    _animationCounter += 1;
  }, 250);
}

function kill(creepName) {

  setTimeout(function() {
    $('.creep-block.' + creepName).remove();
  }, 750);

  for (var i = 0; i < _creeps.length; i++) {

    if(Object.keys(_creeps[i]).toString() == creepName) {

      LevelStore.setTile(_creeps[i][creepName].tile, 0);

      CreepStore.emitChange();
      break;
    }

  }

}

function settleDamage(creepName, damage) {

  for (var i = 0; i < _creeps.length; i++) {

    if(Object.keys(_creeps[i]).toString() == creepName) {

      _creeps[i][creepName].hp -= damage;

      if(_creeps[i][creepName].hp <= 0) kill(creepName);

      CreepStore.emitChange();
      break;
    }

  }

}

var CreepStore = assign({}, EventEmitter.prototype, {

  initiateCreep: initiateCreep,

  getCreep: getCreep,

  startCreepAnimationLoop: startCreepAnimationLoop,

  getTilePosition: getTilePosition,

  settleDamage: settleDamage,

  turnOnAI: turnOnAI,

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

  //   default:
  //     return true;
  // }

  // CreepStore.emitChange();

  // return true;
});

module.exports = CreepStore;
