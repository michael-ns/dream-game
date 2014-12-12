var React = require('react');

var ChampStore = require('../stores/champStore');

function getStateFromStore() {
  return {
    champHP: ChampStore.getChampHP()
  }
}

var Dashboard = React.createClass({
  getInitialState: function() {
    return getStateFromStore();
  },

  componentDidMount: function() {
    ChampStore.addChangeListener(this.onChange);
  },

  render: function() {
    return (
      <div className="dashboard">
        <p>Champ HP: {this.state.champHP}</p>
      </div>
    );
  },

  onChange: function() {
    return this.setState(getStateFromStore());
  }

});

module.exports = Dashboard;