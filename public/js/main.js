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
var Creep = require('./components/creep');

var ChampStore = require('./stores/champStore');
var CreepStore = require('./stores/creepStore');

var Game = React.createClass({
  onKeyPress: function(e) {
    var keyCode = e.which;
    
    if (keyCode == 119 ||
        keyCode == 115 ||
        keyCode == 97 ||
        keyCode == 100) {
      ChampActionCreators.moveChamp(keyCode);
    } else if (keyCode == 106) {
      ChampActionCreators.champAttack();
    }
  },

  onClickStartGame: function(e) {
    React.renderComponent(
      Champ(), document.getElementById('champ')
    );

    React.renderComponent(
      Creep(), document.getElementById('creep')
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
        <div id="creep"></div>
      </div>
    )
  }
});

module.exports = Game;

React.renderComponent(
  Game(), document.getElementById('board')
);