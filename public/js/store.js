var GameDispatcher = require('./dispatcher');
var EventEmitter = require('events').EventEmitter;
var GameConstants = require('./constants');
var assign = require('object-assign');
var $ = require('jquery');

var CHANGE_EVENT = 'change';

var _mapTiles = null;
var _champPosition = [0, 0];
var _creepPosition = [0, 0];
var _animationCounter = 0;
var _champFaceDirection = "down";
var _tileWidth = 50;
var _charWidth = 32;

function updateChampinTiles() {

  var canMoveto = false;

  switch(_champFaceDirection) {
    case "up":
      _mapTiles[_champPosition[1]][_champPosition[0]] = 0;
      _champPosition[1] -= 1;
      break;

    case "down":
      _mapTiles[_champPosition[1]][_champPosition[0]] = 0;
      _champPosition[1] += 1;
      break;

    case "left":
      _mapTiles[_champPosition[1]][_champPosition[0]] = 0;
      _champPosition[0] -= 1;
      break;

    case "right":
      _mapTiles[_champPosition[1]][_champPosition[0]] = 0;
      _champPosition[0] += 1;
      break;

    default:
      break;
  }

  _mapTiles[_champPosition[1]][_champPosition[0]] = 1;

}

function canMoveTo() {
  var canMove = false;

  switch(_champFaceDirection) {
    case "up":
      if(_champPosition[1] != 0) canMove = true;
      break;

    case "down":
      if(_champPosition[1] != 7) canMove = true;
      break;

    case "left":
      if(_champPosition[0] != 0) canMove = true;
      break;

    case "right":
      if(_champPosition[0] != 7) canMove = true;
      break;

    default:
      break;
  }

  return canMove;
}

function setChampFaceDirection(keyCode) {
  switch(keyCode) {
    case 119:
      _champFaceDirection = "up";
      break;

    case 115:
      _champFaceDirection = "down";
      break;

    case 97:
      _champFaceDirection = "left";
      break;

    case 100:
      _champFaceDirection = "right";
      break;

    default:
      break;
  }
}

function getChampPosition() {
  var champPositionInPixel = [0, 0];
  var champTilePosition = $('.player').position();

  champPositionInPixel[0] = champTilePosition.left + ((_tileWidth - _charWidth) * 0.5);
  champPositionInPixel[1] = champTilePosition.top + ((_tileWidth - _charWidth) * 0.5);

  return champPositionInPixel;
}

function getCreepPosition() {
  var creepPositionInPixel = [0, 0];
  var creepTilePosition = $('.creep').position();

  console.log(creepTilePosition)

  creepPositionInPixel[0] = creepTilePosition.left + ((_tileWidth - _charWidth) * 0.5);
  creepPositionInPixel[1] = creepTilePosition.top + ((_tileWidth - _charWidth) * 0.5);

  console.log(creepPositionInPixel)

  return creepPositionInPixel;
}

function startChampAnimationLoop() {
  setInterval(function () {
    if (_animationCounter == 3) _animationCounter = 0;

    $('.champ-spirit').attr("id", "champ-" + _champFaceDirection + "-" + _animationCounter.toString());

    _animationCounter += 1;
  }, 250);
}

function startCreepAnimationLoop() {
  setInterval(function () {
    if (_animationCounter == 3) _animationCounter = 0;

    $('.creep-spirit').attr("id", "creep-down-" + _animationCounter.toString());

    _animationCounter += 1;
  }, 250);
}

var GameStore = assign({}, EventEmitter.prototype, {

  renderGameObjects: function() {

    //render the champ
    var champPosition = getChampPosition();

    var champStyle = '"top: ' + champPosition[1].toString() + 'px; left: ' + champPosition[0].toString() + 'px;"';

    $('#board').after('<img class="champ-spirit" id="champ-down-0" style=' + champStyle + '>');

    startChampAnimationLoop();

    //render creeps
    var creepPosition = getCreepPosition();

    var creepStyle = '"top: ' + creepPosition[1].toString() + 'px; left: ' + creepPosition[0].toString() + 'px;"';

    $('#board').after('<img class="creep-spirit" id="creep-down-0" style=' + creepStyle + '>');
    
    startCreepAnimationLoop();
  },

  loadGameMapTiles: function(mapTiles) {
    _mapTiles = mapTiles.tiles;
    _champPosition = mapTiles.champLocation;
    _creepPosition = mapTiles.creepPosition;
  },

  getGameMap: function() {
    return _mapTiles;
  },

  moveChamp: function(keyCode) {
    setChampFaceDirection(keyCode);

    if (canMoveTo()) {
      var moveVector = [0, 0];

      switch(_champFaceDirection) {
        case "up":
          moveVector[1] -= 1;
          break;

        case "down":
          moveVector[1] += 1;
          break;

        case "left":
          moveVector[0] -= 1;
          break;

        case "right":
          moveVector[0] += 1;
          break;

        default:
          break;
      }

      //actually move our champ
      $('.champ-spirit').animate({
        left : "+=" + (moveVector[0] * _tileWidth).toString(),
        top: "+=" + (moveVector[1] * _tileWidth).toString()
      }, 1000);

      //update champ position in tiles map
      updateChampinTiles();
    }
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
