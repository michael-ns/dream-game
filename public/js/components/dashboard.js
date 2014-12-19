var React = require('react');

var DashboardStore = require('../stores/dashboardStore');

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

  render: function() {

    console.log(this.state.panelData)

    return (
      <div className="dashboard">
        <p>Massage: {this.state.panelData.msg}</p>
        <p>Champ Stamina: {this.state.panelData.stamina[0]} / {this.state.panelData.stamina[1]}</p>
      </div>
    );
  },

  onChange: function() {
    return this.setState(getStateFromStore());
  }

});

module.exports = Dashboard;