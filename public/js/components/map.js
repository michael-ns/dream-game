var React = require('react');
var $ = require('jquery');

var MapStore = require('../stores/mapStore');
var MapAcionCreators = require('../actions/mapActionCreators');

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
        mapTile = <img width="50" height="50" className="player" src={'img/player-tile.png'} />;
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

var Map = React.createClass({
  getInitialState: function() {
    return{
      tiles: MapStore.getMap()
    }
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
  }
});

module.exports = Map;