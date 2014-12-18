var React = require('react');
var $ = require('jquery');

var ChampStore = require('../stores/champStore');
var LevelAcionCreators = require('../actions/levelActionCreators');

var Champ = React.createClass({
  getInitialState: function() {
    return {
      champ: ChampStore.getChamp(this.props.objectName)
    };
  },

  componentDidMount: function() {
    ChampStore.addChangeListener(this.onChange);
  },

  render: function() {

    var champStyle = {
      top: (this.state.champ.tile[0] * 50) + 59,
      left: (this.state.champ.tile[1] * 50) + 340,
      position: 'fixed'
    };

    return (
      <div className="champ-block" style={champStyle}>
        <img className="champ-spirit" id="champ-down-0" />
        <div className="champ-HP">{this.state.champ.hp}</div>
      </div>
    );
  },
  onChange: function() {
    return this.setState(getStateFromStore());
  }

});

module.exports = Champ;