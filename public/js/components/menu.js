var React = require('react');

var LevelStore = require('../stores/levelStore');
var levelList = require('../../map/level-list.json');

var Menu = React.createClass({

  handleSubmit: function(e) {
    e.preventDefault();
    var level = this.refs.levelList.getDOMNode().value.trim();

    LevelStore.setLevel(level);
    window.location.href = document.URL + "level";
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