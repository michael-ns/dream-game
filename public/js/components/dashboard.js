var React = require('react');

var DashboardStore = require('../stores/dashboardStore');
var LevelAcionCreators = require('../actions/levelActionCreators');

function getStateFromStore() {
  return {
    panelData: DashboardStore.getData()
  }
}

var Dashboard = React.createClass({
  getInitialState: function() {
    return getStateFromStore();
  },

  componentDidMount: function() {
    DashboardStore.addChangeListener(this.onChange);
  },

  handleOnClick: function(e) {
    LevelAcionCreators.endTurn();
  },

  render: function() {

    var turnIndicator = "";

    if(this.state.panelData.turn) {
      turnIndicator = "My Turn";
    } else {
      turnIndicator = "AI's Turn";
    }

    return (
      <div className="dashboard">
        <p>Massage: {this.state.panelData.msg}</p>
        <p>Champ Stamina: {this.state.panelData.stamina[0]} / {this.state.panelData.stamina[1]}</p>
        <p>Turn: {turnIndicator}</p>
        <button onClick={this.handleOnClick}>End Turn</button>
      </div>
    );
  },

  onChange: function() {
    return this.setState(getStateFromStore());
  }

});

module.exports = Dashboard;