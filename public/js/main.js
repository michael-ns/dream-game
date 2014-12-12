var React = require('react');
var ce = require('cloneextend');
var $ = require('jquery');

var MapActionCreators = require('./actions/mapActionCreators');
var DashboardActionCreators = require('./actions/dashboardActionCreators');
var ChampActionCreators = require('./actions/champActionCreators');
var CreepActionCreators = require('./actions/creepActionCreators');

var Map = require('./components/map');
var Dashboard = require('./components/dashboard');
var Champ = require('./components/champ');
var CreepOne = require('./components/creepOne');
var CreepTwo = require('./components/creepTwo');

var ChampStore = require('./stores/champStore');
var CreepStore = require('./stores/creepStore');

var Game = React.createClass({
  onKeyPress: function(e) {
    var keyCode = e.which;

    ChampActionCreators.handleKeyPress(keyCode);
  },

  onClickStartGame: function(e) {
    React.renderComponent(
      Champ(), document.getElementById('champ')
    );

    React.renderComponent(
      CreepOne(), document.getElementById('creep-one')
    );

    React.renderComponent(
      CreepTwo(), document.getElementById('creep-two')
    );

    React.renderComponent(
      Dashboard(), document.getElementById('dashboard')
    );

    ChampStore.startChampAnimationLoop();
    CreepStore.startCreepAnimationLoop();
  },

  render: function() {
    return (
      <div className="game-wrapper" onKeyPress={this.onKeyPress}>
        <div className="map"><Map /></div>
        <div><button className="start-btn" onClick={this.onClickStartGame}>Game Start</button></div>
        <div id="champ"></div>
        <div id="creep-one"></div>
        <div id="creep-two"></div>
        <div id="dashboard"></div> 
      </div>
    )
  }
});

module.exports = Game;

React.renderComponent(
  Game(), document.getElementById('board')
);