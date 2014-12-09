var React = require('react');

var ChampStore = require('../stores/champStore');
var ChampAcionCreators = require('../actions/champActionCreators');

var Champ = React.createClass({
  render: function() {
    var champPosition = ChampStore.getChampPosition();

    var champStyle = {
      top: champPosition[0],
      left: champPosition[1]
    };

    return (
      <div style={champStyle}>
        <img className="champ-spirit" id="champ-down-0" style={champStyle} />
      </div>
    );
  }

});

module.exports = Champ;