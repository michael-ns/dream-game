var React = require('react');
var $ = require('jquery');

var LevelStore = require('../stores/levelStore');
var ChampStore = require('../stores/champStore');
var CreepStore = require('../stores/creepStore');
var LevelActionCreators = require('../actions/levelActionCreators');
var ChampActionCreators = require('../actions/champActionCreators');
var Champ = require('./champ');
var Creep = require('./creep');
var Dashboard = require('./dashboard');

var Row = React.createClass({

  render: function(){
    var tiles = this.props.tileRow.map(function(tile){
      return <Tiles tile={tile} />
    });

    return (
      <div className="row">
        {tiles}
      </div>
    )
  }
});

var Tiles = React.createClass({
  render: function(){
    var mapTile = <img width="50" height="50" src={'img/empty-tile.png'} />;

    switch(this.props.tile) {
      case "champ":
        mapTile = <img width="50" height="50" className="champ" src={'img/player-tile.png'} />;
        break;

      case "creepA":
        mapTile = <img width="50" height="50" className="creep creepA" src={'img/creep-tile.png'} />;
        break;

      case "creepB":
        mapTile = <img width="50" height="50" className="creep creepB" src={'img/creep-tile.png'} />;
        break;

      default:
        break;
    }

    return (
      <div>
        {mapTile}
      </div>
    )
  }
});

function getMapStateFromStore() {
  return {
    tiles: LevelStore.getMap()
  };
}


var Map = React.createClass({

  getInitialState: function() {
    return getMapStateFromStore();
  },

  componentDidMount: function() {
    LevelStore.addChangeListener(this.onChange);
  },

  render: function() {
    var row = this.state.tiles.map(function(row){
      return <Row tileRow={row} />
    });

    return (
      <div className="row">
        {row}
      </div>
    )
  },

  onChange: function() {
    return this.setState(getMapStateFromStore());
  }
});

var LevelObject = React.createClass({

  render: function(){
    var currentObject = this.props.levelObject;

    switch(Object.keys(currentObject).toString()) {
      case "champ":
        return (
          <Champ objectName="champ" />
        )
        break;

      case "creepA":
        return (
          <Creep objectName="creepA" />
        )
        break;

      case "creepB":
        return (
          <Creep objectName="creepB" />
        )
        break;

      default:
        return (
          <div>No game objects found</div>
        )
        break;
    }
  }
});

var LevelObjects = React.createClass({

  getInitialState: function() {
    return{
      LevelObjects: LevelStore.getLevelObjects()
    }
  },

  render: function() {

    var objects = this.state.LevelObjects.map(function(object){
      return <LevelObject levelObject={object} />
    });

    return (
      <div className="row">
        {objects}
      </div>
    )
  }

});

var Level = React.createClass({

  componentDidMount: function() {
    $('.inputTracking').focus();
  },

  handleKeyPress: function(e) {
    var keyCode = e.which;

    ChampActionCreators.handleKeyPress(keyCode);
  },

  render: function() {
    return (
      <div className="level">

        <Map />
        <LevelObjects /><br />

        <input type="text" className="inputTracking" value="Input Tracking"
          onKeyPress={this.handleKeyPress} /><br /><br />

        <Dashboard />

      </div>
    )
  }
});

module.exports = Level;