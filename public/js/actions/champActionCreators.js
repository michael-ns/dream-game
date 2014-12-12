var GameDispatcher = require('../dispatcher');
var GameConstants = require('../constants');

module.exports = {
  handleKeyPress: function(keyCode) {
    GameDispatcher.handleViewAction({
      actionType: GameConstants.HANDLE_KEY_PRESS,
      keyCode: keyCode
    });
  }
};