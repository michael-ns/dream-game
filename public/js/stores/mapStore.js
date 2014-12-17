var GameDispatcher = require('../dispatcher');
var ce = require('cloneextend');
var EventEmitter = require('events').EventEmitter;
var GameConstants = require('../constants');
var assign = require('object-assign');
var $ = require('jquery');
var CHANGE_EVENT = 'change';

//var ChampStore = require('./champStore');
//var CreepStore = require('./creepStore');

var Map = require('../components/map');

var _level = null;
var _map = null;
var _levelObjects = null;

function startGame(level) {

  // _level = require('../../map/#{level}.json');
  // _map = _level.tiles;
  // _levelObjects = _level.levelObjects;

  // //render the map
  // $('#dashboard').after('<div id="map"></div>');

  // React.renderComponent(
  //   Map(), document.getElementById('map')
  // );

  // //render all game objects
  // _levelObjects.keys(hash).forEach(function (key) {
  //   var current_object = hash[key];

  //   switch(key) {
  //     case "champ":
  //       var Champ = require('../stores/champStore');
  //       ChampStore.initiateChamp(current_object);
  //       break;

  //     case "creeps":
  //       var Creeps = require('../stores/creepStore');
  //       CreepStore.initiateCreeps(key, current_object);
  //       break;

  //     default:
  //       break;
  //   }
  // })

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

var MapStore = assign({}, EventEmitter.prototype, {

  // startGame: startGame,

  // getMap: function() {
  //   return _map;
  // },

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

  // MapStore.emitChange();

  // return true;
});

module.exports = MapStore;
