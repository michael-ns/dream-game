var GameDispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var GameConstants = require('../constants');
var assign = require('object-assign');
var $ = require('jquery');
var CHANGE_EVENT = 'change';

var MapStore = require('../stores/mapStore');

var _champTile = null;
var _champPosition = [0, 0];
var _tileWidth = 50;
var _charWidth = 32;
var _animationCounter = 0;
var _champFaceDirection = "down";

function loadChampTile() {
  if(_champTile === null) _champTile = MapStore.getChampInitialTile();
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

var ChampStore = assign({}, EventEmitter.prototype, {
  getChampPosition: function() {
    loadChampTile();
    loadChampPosition();
    return _champPosition;
  },

  startChampAnimationLoop: function() {
    startChampAnimationLoop();
  }
});

// Register to handle all updates
GameDispatcher.register(function(payload) {
  var action = payload.action;
  
  switch(action.actionType) {
    case GameConstants.UPDATE_MAP:
      location = action.location;
      value = action.value;
      updateMap(location, value);
      break;

    default:
      return true;
  }

  ChampStore.emitChange();

  return true;
});

module.exports = ChampStore;
