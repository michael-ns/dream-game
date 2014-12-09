var GameDispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var GameConstants = require('../constants');
var assign = require('object-assign');
var $ = require('jquery');
var CHANGE_EVENT = 'change';

var mapTiles = require('../../map/level-1.json');

var _map = null;

function loadMap() {
  _map = mapTiles.tiles;
}

var MapStore = assign({}, EventEmitter.prototype, {
  getMap: function() {
    if (_map === null) {
      loadMap();
    }

    return _map;
  },

  getChampInitialTile: function() {
    return mapTiles.champLocation;
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

  MapStore.emitChange();

  return true;
});

module.exports = MapStore;
