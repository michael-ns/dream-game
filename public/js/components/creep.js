var React = require('react');
var $ = require('jquery');

var CreepStore = require('../stores/creepStore');
var CreepAcionCreators = require('../actions/creepActionCreators');

var Creep = React.createClass({
  getInitialState: function() {
    return {
      creep: CreepStore.getCreep(this.props.objectName)
    };
  },

  componentDidMount: function() {
    CreepStore.addChangeListener(this.onChange);
  },

  componentWillUnmount: function() {
    CreepStore.removeChangeListener(this.onChange);
  },

  render: function() {

    var creepStyle = {
      top: (this.state.creep.tile[0] * 50) + 59,
      left: (this.state.creep.tile[1] * 50) + 340,
      position: 'fixed'
    };

    return (
      <div className="creep-block " style={creepStyle}>
        <img className="creep-spirit" id="creep-down-0" />
        <div className="creep-HP">{this.state.creep.hp}</div>
      </div>
    );
  },

  onChange: function() {
    return this.setState(getStateFromStore());
  }

});

module.exports = Creep;