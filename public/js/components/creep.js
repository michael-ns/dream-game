var React = require('react');
var $ = require('jquery');

var CreepStore = require('../stores/creepStore');
var CreepAcionCreators = require('../actions/creepActionCreators');

function getStateFromStore(objName) {
  return {
    creep: CreepStore.getCreep(objName)
  };
}

var Creep = React.createClass({
  getInitialState: function() {
    return getStateFromStore(this.props.objectName);
  },

  componentDidMount: function() {
    CreepStore.addChangeListener(this.onChange);
    CreepStore.startCreepAnimationLoop(this.props.objectName);
  },

  componentWillUnmount: function() {
    CreepStore.removeChangeListener(this.onChange);
  },

  render: function() {
    
    var creepClass = "creep-block " + this.props.objectName;

    var creepStyle = {
      top: (this.state.creep.tile[0] * 50) + 59,
      left: (this.state.creep.tile[1] * 50) + 320,
      position: 'fixed'
    };

    var creepFaceDirection = "creep-" + this.state.creep.faceDirection + "-0";

    return (
      <div className={creepClass} style={creepStyle}>
        <img className="creep-spirit" id={creepFaceDirection} />
        <div className="creep-HP">{this.state.creep.hp}</div>
      </div>
    );
  },

  onChange: function() {
    return this.setState(getStateFromStore(this.props.objectName));
  }

});

module.exports = Creep;