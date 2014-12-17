var React = require('react');

var MapStore = require('../stores/mapStore');
var levelList = require('../../map/level-list.json');

var Menu = React.createClass({

  handleSubmit: function(e) {
    e.preventDefault();
    var level = this.refs.levelList.getDOMNode().value.trim();

    MapStore.startGame(level);
  },
  
  render: function() {
    var level = levelList.levelList.map(function(level){
      return <option value={level}>{level}</option>
    });

    return (
      <form className="menu" onSubmit={this.handleSubmit}>
        <select className="level-dropdown" ref="levelList">
          {level}
        </select>
        <input type="submit" value="Start" />
      </form>
    )
  }

});

module.exports = Menu;