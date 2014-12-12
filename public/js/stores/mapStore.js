var GameDispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var GameConstants = require('../constants');
var assign = require('object-assign');
var $ = require('jquery');
var CHANGE_EVENT = 'change';

var _mapTiles = require('../../map/level-1.json');

var _map = null;

function loadMap() {
  _map = _mapTiles.tiles;
}

function champCollisionHandler(champPosition) {

  var damageToChamp = 0;
  
  var objectInPosition = _mapTiles.tiles[champPosition[0]][champPosition[1]];

  if (objectInPosition != 0) {

    if(objectInPosition == 2) {

      damageToChamp = 1;

    }

  }

  return damageToChamp;
}

function getTileObject(coordinate) {
  return _map[coordinate[0]][coordinate[1]];
}

function attackTile(coordinate) {
  var tileObject = getTileObject(coordinate);

  if(tileObject != 0) {

    if(tileObject == 2) {

      return true;

    }

  }

  return false;
}

function setTile(tile, value) {
  _map[tile[0]][tile[1]] = value;
}

var MapStore = assign({}, EventEmitter.prototype, {
  getMap: function() {
    if (_map === null) {
      loadMap();
    }

    return _map;
  },

  getChampInitialTile: function() {
    return _mapTiles.champLocation;
  },

  getCreepInitialTile: function() {
    return _mapTiles.creepLocation;
  },

  champCollisionHandler: champCollisionHandler,

  attackTile: attackTile,

  setTile:setTile,

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
    case GameConstants.UPDATE_MAP:
      location = action.location;
      value = action.value;
      updateMap(location, value);
      break;

    case GameConstants.CHAMP_COLLISION_HANDLER:
      champPosition = action.champPosition;
      champCollisionHandler(champPosition);
      break;

    default:
      return true;
  }

  MapStore.emitChange();

  return true;
});

module.exports = MapStore;
