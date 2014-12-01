var GameDispatcher = require('./dispatcher');
var EventEmitter = require('events').EventEmitter;
var GameConstants = require('./constants');
var assign = require('object-assign');
var $ = require('jquery');

var CHANGE_EVENT = 'change';

var _mapTiles = null;
var _champPosition = [0, 0];

function upDateChampinTiles(direction) {

  _mapTiles[_champPosition[1]][_champPosition[0]] = 0;

  switch(direction) {
    case "up":
      if(_champPosition[1] != 0) _champPosition[1] -= 1;
      break;

    case "down":
      if(_champPosition[1] != 8) _champPosition[1] += 1;
      break;

    case "left":
      if(_champPosition[0] != 0) _champPosition[0] -= 1;
      break;

    case "right":
      if(_champPosition[0] != 8) _champPosition[0] += 1;
      break;

    default:
      break;
  }

  _mapTiles[_champPosition[1]][_champPosition[0]] = 1;

}

var GameStore = assign({}, EventEmitter.prototype, {

  loadGameMapTiles: function(mapTiles) {
    _mapTiles = mapTiles.tiles;
    _champPosition = mapTiles.champLocation;
  },

  getGameMap: function() {
    return _mapTiles;
  },

  moveChamp: function(keyCode) {
    var moveVector = [0, 0];
    var direction = "";

    switch(keyCode) {

      //move up
      case 119:
        direction = "up";
        moveVector = [0, -50];
        break;

      //move down
      case 115:
        direction = "down";
        moveVector = [0, 50];
        break;

      //move left
      case 97:
        direction = "left";
        moveVector = [-50, 0];
        break;

      //move right
      case 100:
        direction = "right";
        moveVector = [50, 0];
        break;

      default:
        break;
    }

    //actually move our champ
    $('#champ-down-1').animate({
      left : "+=" + moveVector[0].toString(),
      top: "+=" + moveVector[1].toString()
    })

    //update champ position in tiles map
    upDateChampinTiles(direction);
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
    case GameConstants.CARD_SELECT:
      id = action.id;
      cardSelect(id);
      break;

    case GameConstants.ONCLICK_CONFIRM:
      onClickConfirm();
      break;

    case GameConstants.ONCLICK_START_GAME:
      onClickStartGame();
      break;

    default:
      return true;
  }

  // This often goes in each case that should trigger a UI change. This store
  // needs to trigger a UI change after every view action, so we can make the
  // code less repetitive by putting it here.  We need the default case,
  // however, to make sure this only gets called after one of the cases above.
  GameStore.emitChange();

  return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = GameStore;
