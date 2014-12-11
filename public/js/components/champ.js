var React = require('react');

var ChampStore = require('../stores/champStore');
var ChampAcionCreators = require('../actions/champActionCreators');

function getStateFromStore() {
  return {
    position: ChampStore.getChampPosition(),
    hp: ChampStore.getChampHP()
  }
}

var Champ = React.createClass({
  getInitialState: function() {
    return getStateFromStore();
  },

  componentDidMount: function() {
    ChampStore.addChangeListener(this.onChange);
  },

  render: function() {
    var champStyle = {
      top: this.state.position[0],
      left: this.state.position[1],
      position: 'fixed'
    };

    return (
      <div className="champ-block" style={champStyle}>
        <img className="champ-spirit" id="champ-down-0" />
        <div className="champ-HP">{this.state.hp}</div>
      </div>
    );
  },
  onChange: function() {
    return this.setState(getStateFromStore());
  }

});

module.exports = Champ;