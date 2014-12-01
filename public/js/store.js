var GameDispatcher = require('./dispatcher');
var EventEmitter = require('events').EventEmitter;
var GameConstants = require('./constants');
var assign = require('object-assign');
var $ = require('jquery');

var CHANGE_EVENT = 'change';

var _mapTiles = null;
var _champPosition = [0, 0];
var _animationCounter = 0;
var _champFaceDirection = "down";

function updateChampinTiles() {

  _mapTiles[_champPosition[1]][_champPosition[0]] = 0;

  switch(_champFaceDirection) {
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

  startChampAnimationLoop: function() {
    setInterval(function () {
      if (_animationCounter == 3) _animationCounter = 0;

      $('.champ').attr("id", "champ-" + _champFaceDirection + "-" + _animationCounter.toString());

      _animationCounter += 1;
    }, 250);
  },

  moveChamp: function(keyCode) {
    var moveVector = [0, 0];

    switch(keyCode) {

      //move up
      case 119:
        _champFaceDirection = "up";
        moveVector = [0, -50];
        break;

      //move down
      case 115:
        _champFaceDirection = "down";
        moveVector = [0, 50];
        break;

      //move left
      case 97:
        _champFaceDirection = "left";
        moveVector = [-50, 0];
        break;

      //move right
      case 100:
        _champFaceDirection = "right";
        moveVector = [50, 0];
        break;

      default:
        break;
    }

    //update the champ image
    $('.champ').attr("id", "champ-" + _champFaceDirection + "-0");

    //actually move our champ
    $('.champ').animate({
      left : "+=" + moveVector[0].toString(),
      top: "+=" + moveVector[1].toString()
    }, 1000)

    //update champ position in tiles map
    updateChampinTiles();
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
