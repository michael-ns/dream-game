var GameDispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var GameConstants = require('../constants');
var assign = require('object-assign');
var $ = require('jquery');
var CHANGE_EVENT = 'change';

var MapStore = require('../stores/mapStore');
var MapAcionCreators = require('../actions/mapActionCreators');

var _creepTile = null;
var _creepPosition = [0, 0];
var _tileWidth = 50;
var _charWidth = 32;
var _animationCounter = 0;
var _creepFaceDirection = "down";

function loadCreepTile() {
  if(_creepTile === null) _creepTile = MapStore.getCreepInitialTile();
}

function loadCreepPosition() {
  _creepPosition[0] = $('.creep').position().top;
  _creepPosition[0] += (_tileWidth - _charWidth) * 0.5;

  _creepPosition[1] = $('.creep').position().left;
  _creepPosition[1] += (_tileWidth - _charWidth) * 0.5;
}

function startCreepAnimationLoop() {
  setInterval(function () {
    if (_animationCounter == 3) _animationCounter = 0;

    $('.creep-spirit').attr("id", "creep-" + _creepFaceDirection + "-" + _animationCounter.toString());

    _animationCounter += 1;
  }, 250);
}

function kill() {

  setTimeout(function() {
    $('.creep-spirit').remove();
  }, 750);

  
}

var CreepStore = assign({}, EventEmitter.prototype, {
  getCreepPosition: function() {
    loadCreepTile();
    loadCreepPosition();
    return _creepPosition;
  },

  startCreepAnimationLoop: function() {
    startCreepAnimationLoop();
  },

  kill: kill,

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
