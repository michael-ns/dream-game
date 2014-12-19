var GameDispatcher = require('../dispatcher');
var ce = require('cloneextend');
var EventEmitter = require('events').EventEmitter;
var GameConstants = require('../constants');
var assign = require('object-assign');
var $ = require('jquery');
var CHANGE_EVENT = 'change';

var _level = require('../../map/level-1.json');
var _map = null;
var _levelObjects = null;
var _turnIndicator = true;

function setLevel(level) {

  switch(level) {
    case "level-1":
      _level = require('../../map/level-1.json');
      break;

    case "level-2":
      _level = require('../../map/level-2.json');
      break;

    case "level-3":
      _level = require('../../map/level-3.json');
      break;

    default:
      break;
  }

  _map = _level.tiles;
  _levelObjects = _level.levelObjects;

  //load all game objects into stories
  for (var i = 0; i < _levelObjects.length; i++) {
    
    switch(Object.keys(_levelObjects[i]).toString()) {
      case "champ":
        var ChampStore = require('./champStore');
        ChampStore.initiateChamp(_levelObjects[i]);
        break;

      case "creepA":
        var CreepStore = require('./creepStore');
        CreepStore.initiateCreep(_levelObjects[i]);
        break;

      case "creepB":
        var CreepStore = require('./creepStore');
        CreepStore.initiateCreep(_levelObjects[i]);
        break;

      default:
        break;
    }

  }
}

function endTurn() {
  _turnIndicator = false;

  var DashboardStore = require('./dashboardStore');

  DashboardStore.emitChange();
}

function moveTile(currentTile, intendedTile, objectToMove) {

  _map[currentTile[0]][currentTile[1]] = 0;

  _map[intendedTile[0]][intendedTile[1]] = objectToMove;
  
  LevelStore.emitChange();
}

// function champCollisionHandler(champPosition) {

//   var collisionResult = [];
  
//   var objectInPosition = _mapTiles.tiles[champPosition[0]][champPosition[1]];

//   if (objectInPosition != 0) {

//     if(objectInPosition == 2) {

//       collisionResult.push("two");
//       collisionResult.push(1);
//     }

//     if(objectInPosition == 3) {

//       collisionResult.push("three");
//       collisionResult.push(1);
//     }

//   }

//   return collisionResult;
// }

function getTileObject(coordinate) {
  return _map[coordinate[0]][coordinate[1]];
}

function attackTile(coordinate) {
  var tileObject = getTileObject(coordinate);

  console.log("tile: ", coordinate, " object: ", tileObject)

  if(tileObject != 0) {
    if(tileObject == "creepA" || tileObject == "creepB") return true;
  }

  return false;
}

function setTile(tile, value) {
  _map[tile[0]][tile[1]] = value;
  LevelStore.emitChange();
}

var LevelStore = assign({}, EventEmitter.prototype, {

  setLevel: setLevel,

  getTurn: function() {
    return _turnIndicator;
  },

  getLevelObjects: function() {
    return _levelObjects;
  },

  // startGame: startGame,

  getMap: function() {
    return _map;
  },

  moveTile: moveTile,

  // getChampInitialTile: function() {
  //   return _mapTiles.champLocation;
  // },

  // getCreepInitialTiles: function() {
  //   return _mapTiles.creepLocations;
  // },

  // champCollisionHandler: champCollisionHandler,

  attackTile: attackTile,

  setTile:setTile,

  getTileObject: getTileObject,

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
    case GameConstants.END_TURN:
      endTurn();
      break;

    default:
      return true;
  }

  LevelStore.emitChange();

  return true;
});

module.exports = LevelStore;
