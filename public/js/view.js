var React = require('react');
var ReactPropTypes = React.PropTypes;
var $ = require('jquery');
var GameActions = require('./actions');
var GameStore = require('./store');

function getGameState() {
  return{
    gameMap: GameStore.getGameMap()
  }
}

var Game = React.createClass({
  getInitialState:function(){
    return getGameState();
  },

  render:function(){
    return (
      <div className="map"><Map tiles={this.state.gameMap} /></div>
      )
  }
});

var Map = React.createClass({

  render: function(){
    var row = this.props.tiles.map(function(row){
      return <Row tileRow={row} />
    });


    return (
      <div className="row">
        {row}
      </div>
    )
  }
});

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
      case 1:
        mapTile = <img width="50" height="50" src={'img/player-tile.png'} />;
        break;

      case 2:
        mapTile = <img width="50" height="50" src={'img/creep-tile.png'} />;
        break;

      default:
        break;
    }



    return (
      <div className="col-md-1">
        {mapTile}
      </div>
    )
  }
});

module.exports = Game;