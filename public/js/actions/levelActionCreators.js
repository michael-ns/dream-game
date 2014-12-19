var GameDispatcher = require('../dispatcher');
var GameConstants = require('../constants');

module.exports = {
  endTurn: function() {
    GameDispatcher.handleViewAction({
      actionType: GameConstants.END_TURN
    });
  }
};