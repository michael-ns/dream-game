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

  onClickStartGame:function(e){
    //insert champ image to player location
    var playerPosition = $('.player').position();

    playerPosition.left += 9;
    playerPosition.top += 9;

    var style = '"top: ' + playerPosition.top.toString() + 'px; left: ' + playerPosition.left.toString() + 'px;"';

    $('#board').after('<img class="champ" id="champ-down-0" style=' + style + '>');

    GameStore.startChampAnimationLoop();
  },

  handleKey:function(e){
    var keyCode = e.which;

    //if any of the move key was pressed
    if (keyCode == 119 ||
        keyCode == 115 ||
        keyCode == 97 ||
        keyCode == 100) {
      GameStore.moveChamp(keyCode);
    }

    this.forceUpdate();
  },

  render:function(){
    return (
      <div className="wrapper" onKeyPress={this.handleKey}>
        <div className="map"><Map tiles={this.state.gameMap} /></div>
        <div><button className="start-btn" onClick={this.onClickStartGame}>Game Start</button></div>
      </div>
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
        mapTile = <img width="50" height="50" className="player" src={'img/player-tile.png'} />;
        break;

      case 2:
        mapTile = <img width="50" height="50" className="creep" src={'img/creep-tile.png'} />;
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

module.exports = Game;