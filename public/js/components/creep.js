var React = require('react');

var CreepStore = require('../stores/creepStore');
var CreepAcionCreators = require('../actions/creepActionCreators');

var Creep = React.createClass({
  render: function() {
    var creepPosition = CreepStore.getCreepPosition();

    var creepStyle = {
      top: creepPosition[0],
      left: creepPosition[1]
    };

    return (
      <div style={creepStyle}>
        <img className="creep-spirit" id="creep-down-0" style={creepStyle} />
      </div>
    );
  }

});

module.exports = Creep;