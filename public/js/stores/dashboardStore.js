var GameDispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var GameConstants = require('../constants');
var assign = require('object-assign');
var $ = require('jquery');
var CHANGE_EVENT = 'change';

var _msg = "BOOM";
var _stamina = [10, 10];

function getData() {
  return {
    msg: _msg,
    stamina: _stamina
  }
}

function setMsg(msg) {
  _msg = msg;
  
  DashboardStore.emitChange();
}

function setChampStamina(_currentStamina, _maxStamina) {
  _stamina[0] = _currentStamina;
  _stamina[1] = _maxStamina;

  DashboardStore.emitChange();
}

var DashboardStore = assign({}, EventEmitter.prototype, {

  setMsg: setMsg,

  getData: getData,

  setChampStamina: setChampStamina,

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

module.exports = DashboardStore;
