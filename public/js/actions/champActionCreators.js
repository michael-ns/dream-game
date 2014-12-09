var GameDispatcher = require('../dispatcher');
var GameConstants = require('../constants');

module.exports = {
  moveChamp: function(keyCode) {
    GameDispatcher.handleViewAction({
      actionType: GameConstants.MOVE_CHAMP,
      keyCode: keyCode
    });
  }
};