var React = require('react');

var CreepStore = require('../stores/creepStore');
var CreepAcionCreators = require('../actions/creepActionCreators');

function getStateFromStore() {
  return {
    position: CreepStore.getCreepPositions().three,
    hp: CreepStore.getCreepHPs().three
  }
}

var CreepTwo = React.createClass({
  getInitialState: function() {
    return getStateFromStore();
  },

  componentDidMount: function() {
    CreepStore.addChangeListener(this.onChange);
  },

  componentWillUnmount: function() {
    CreepStore.removeChangeListener(this.onChange);
  },

  render: function() {
    var creepStyle = {
      top: this.state.position[0],
      left: this.state.position[1],
      position: 'fixed'
    };

    return (
      <div className="creep-block-two" style={creepStyle}>
        <img className="creep-spirit" id="creep-down-0" />
        <div className="creep-HP">{this.state.hp}</div>
      </div>
    );
  },

  onChange: function() {
    return this.setState(getStateFromStore());
  }

});

module.exports = CreepTwo;