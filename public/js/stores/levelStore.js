var GameDispatcher = require('../dispatcher');
var ce = require('cloneextend');
var EventEmitter = require('events').EventEmitter;
var GameConstants = require('../constants');
var assign = require('object-assign');
var $ = require('jquery');
var CHANGE_EVENT = 'change';

var _level = null;
var _map = null;
var _levelObjects = null;

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

// function getTileObject(coordinate) {
//   return _map[coordinate[0]][coordinate[1]];
// }

// function attackTile(coordinate) {
//   var tileObject = getTileObject(coordinate);

//   if(tileObject != 0) {

//     if(tileObject == 2) {

//       return true;

//     }

//   }

//   return false;
// }

// function setTile(tile, value) {
//   _map[tile[0]][tile[1]] = value;
// }

var LevelStore = assign({}, EventEmitter.prototype, {

  setLevel: setLevel,

  getLevelObjects: function() {
    return _levelObjects;
  },

  // startGame: startGame,

  getMap: function() {
    return _map;
  }

  // getChampInitialTile: function() {
  //   return _mapTiles.champLocation;
  // },

  // getCreepInitialTiles: function() {
  //   return _mapTiles.creepLocations;
  // },

  // champCollisionHandler: champCollisionHandler,

  // attackTile: attackTile,

  // setTile:setTile,

  // getTileObject: getTileObject,

  // //not specific to this game
  // emitChange: function() {
  //   this.emit(CHANGE_EVENT);
  // },

  // /**
  //  * @param {function} callback
  //  */
  // addChangeListener: function(callback) {
  //   this.on(CHANGE_EVENT, callback);
  // },

  // /**
  //  * @param {function} callback
  //  */
  // removeChangeListener: function(callback) {
  //   this.removeListener(CHANGE_EVENT, callback);
  // }
});

// Register to handle all updates
GameDispatcher.register(function(payload) {
  // var action = payload.action;
  
  // switch(action.actionType) {
  //   case GameConstants.UPDATE_MAP:
  //     location = action.location;
  //     value = action.value;
  //     updateMap(location, value);
  //     break;

  //   case GameConstants.CHAMP_COLLISION_HANDLER:
  //     champPosition = action.champPosition;
  //     champCollisionHandler(champPosition);
  //     break;

  //   default:
  //     return true;
  // }

  // LevelStore.emitChange();

  // return true;
});

module.exports = LevelStore;
