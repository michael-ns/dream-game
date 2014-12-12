var GameDispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var GameConstants = require('../constants');
var assign = require('object-assign');
var $ = require('jquery');
var CHANGE_EVENT = 'change';

var MapStore = require('../stores/mapStore');
var MapAcionCreators = require('../actions/mapActionCreators');

var _creepTiles = null;
var _creepPositions = new Object;
var _tileWidth = 50;
var _charWidth = 32;
var _animationCounter = 0;
var _creepFaceDirection = "down";
var _creepHPs = {
  "two": 3,
  "three": 4
};

function loadCreepTile() {
  if(_creepTiles === null) _creepTiles = MapStore.getCreepInitialTiles();
}

function loadCreepPositions() {
  _creepPositions.two = [];

  _creepPositions.two[0] = $('.creep.two').position().top;
  _creepPositions.two[0] += (_tileWidth - _charWidth) * 0.5;

  _creepPositions.two[1] = $('.creep.two').position().left;
  _creepPositions.two[1] += (_tileWidth - _charWidth) * 0.5;

  _creepPositions.three = [];

  _creepPositions.three[0] = $('.creep.three').position().top;
  _creepPositions.three[0] += (_tileWidth - _charWidth) * 0.5;

  _creepPositions.three[1] = $('.creep.three').position().left;
  _creepPositions.three[1] += (_tileWidth - _charWidth) * 0.5;

}

function startCreepAnimationLoop() {
  setInterval(function () {
    if (_animationCounter == 3) _animationCounter = 0;

    $('.creep-spirit').attr("id", "creep-" + _creepFaceDirection + "-" + _animationCounter.toString());

    _animationCounter += 1;
  }, 250);
}

function kill(creepName) {

  if(creepName == "two") {
    setTimeout(function() {
      $('.creep-block-one').remove();
    }, 750);
  }

  if(creepName == "three") {
    setTimeout(function() {
      $('.creep-block-two').remove();
    }, 750);
  }

}

function takeDamage(creepName, damage) {

  _creepHPs[creepName] -= damage;

  console.log(creepName, damage)

  if(_creepHPs[creepName] <= 0) {
    kill(creepName);
    MapStore.setTile(_creepTiles[creepName], 0);
  }

  CreepStore.emitChange();
}

var CreepStore = assign({}, EventEmitter.prototype, {
  getCreepPositions: function() {
    loadCreepTile();
    loadCreepPositions();

    return _creepPositions;
  },

  getCreepHPs: function() {
    return _creepHPs;
  },

  takeDamage: takeDamage,

  startCreepAnimationLoop: function() {
    startCreepAnimationLoop();
  },

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

    default:
      return true;
  }

  CreepStore.emitChange();

  return true;
});

module.exports = CreepStore;
