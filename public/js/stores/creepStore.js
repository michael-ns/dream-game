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

  for (var i = 0; i < _creeps.length; i++) {
    _creeps[i][Object.keys(_creeps[i]).toString()].stamina = 2;
  }

  LevelStore.nextTurn();
}

function singleCreepAI(creep) {

  while(creep.stamina > 0) {
    singleCreepActionAI(creep);
  }

}

function singleCreepActionAI(creep) {
  if(canCreepSeeChamp(creep)) {
    //attack champ when champ is around and there is enough stamina
    if(isChampAround(creep) && creep.stamina >= 2) {
      console.log("before attack")
      singleCreepAttackChamp(creep);
    } else {
      //if champ is not around, chase champ
      console.log("before creep move")
      singleCreepChaseChamp(creep);
    }


  } else {
    creep.stamina = 0;
  }
}

function canCreepSeeChamp(creep) {
  var canCreepSeeChamp = false;
  var ChampStore = require('../stores/champStore');
  var champTile = ChampStore.getTile();

  var verticalDistance = champTile[0] - creep.tile[0];
  var horizontalDistance = champTile[1] - creep.tile[1];

  if(Math.abs(verticalDistance) <= creep.vision && Math.abs(horizontalDistance) <= creep.vision) {
    canCreepSeeChamp = true;
  }

  return canCreepSeeChamp;
}

function creepTurn(creep, direction) {
  creep.faceDirection = direction;

  CreepStore.emitChange();
}

function creepMove(creep, direction) {

  creepTurn(creep, direction);

  var moveVector = [0, 0];

  switch(direction) {
    case "up":
        moveVector[0] = -1;
        break;
    case "down":
        moveVector[0] = 1;
        break;
    case "left":
        moveVector[1] = -1;
        break;
    default:
        moveVector[1] = 1;
        break;
  }

  //actually move the creep
  creep.tile[0] += moveVector[0];
  creep.tile[1] += moveVector[1];

  $('.creep-block.' +  creep.objName + '').animate({
    top : "+=" + (moveVector[0] * _tileWidth).toString(),
    left: "+=" + (moveVector[1] * _tileWidth).toString()
  }, 1000);

  console.log("creep tile: ", creep.tile[0], "-", creep.tile[1])

  creep.stamina -= 1;

  CreepStore.emitChange();
}

function singleCreepChaseChamp(creep) {
  var ChampStore = require('../stores/champStore');
  var champTile = ChampStore.getTile();

  var verticalDistance = champTile[0] - creep.tile[0];
  var horizontalDistance = champTile[1] - creep.tile[1];

  if(verticalDistance < 0) {
    creepMove(creep, "up");
    return;
  }

  if(verticalDistance > 0) {
    creepMove(creep, "down");
    return;
  }

  if(horizontalDistance < 0) {
    creepMove(creep, "left");
    return;
  }

  if(horizontalDistance > 0) {
    creepMove(creep, "right");
    return;
  }

}

function singleCreepAttackChamp(creep) {
  //turn to the champ
  var champDirection = "not around";

  var ChampStore = require('../stores/champStore');
  var champTile = ChampStore.getTile();

  var verticalDistance = champTile[0] - creep.tile[0];
  var horizontalDistance = champTile[1] - creep.tile[1];

  if(verticalDistance == 0) {
    if(horizontalDistance == 1) {
      champDirection = "right";
    } else if (horizontalDistance == -1) {
      champDirection = "left";
    }
  }

  if(horizontalDistance == 0) {
    if(verticalDistance == 1) {
      champDirection = "down";
    } else if (verticalDistance == -1) {
      champDirection = "up";
    }
  }

  creep.faceDirection = champDirection;

  CreepStore.emitChange();

  var ChampStore = require('../stores/champStore');
  ChampStore.settleDamage(1);

  creep.stamina -= 2;
}

function isChampAround(creep) {
  var isChampAround = false;
  var ChampStore = require('../stores/champStore');
  var champTile = ChampStore.getTile();

  var verticalDistance = champTile[0] - creep.tile[0];
  var horizontalDistance = champTile[1] - creep.tile[1];

  if((verticalDistance == 0 && Math.abs(horizontalDistance) == 1) ||
    (horizontalDistance == 0 && Math.abs(verticalDistance) == 1)) {
    isChampAround = true;
  }

  return isChampAround;
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

function kill(creepName) {

  setTimeout(function() {
    $('.creep-block.' + creepName).remove();
  }, 750);

  for (var i = 0; i < _creeps.length; i++) {

    if(Object.keys(_creeps[i]).toString() == creepName) {

      LevelStore.setTile(_creeps[i][creepName].tile, 0);

      _creeps.splice(i, 1);

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

function startCreepAnimationLoop(creepName) {
  setInterval(function () {

    if (_animationCounter == 3) _animationCounter = 0;

    $('.' + creepName + ' > img').attr("id", "creep-" + getCreep(creepName).faceDirection + "-" + _animationCounter.toString());

    _animationCounter += 1;
  }, 250);
}

var CreepStore = assign({}, EventEmitter.prototype, {

  initiateCreep: initiateCreep,

  getCreep: getCreep,

  getTilePosition: getTilePosition,

  startCreepAnimationLoop: startCreepAnimationLoop,

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
