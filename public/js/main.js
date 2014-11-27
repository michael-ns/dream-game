var ce = require('cloneextend');
var $ = require('jquery');
var GameView = require('./view');
var React = require('react');
var GameStore = require('./store');

//Map = require('./../../model/map');
//champ = require('./../../model/champ');
//Creep = require('./../../model/creep');
mapTiles = require('./../map/level-1.json');

//load map from json
var gameMapTiles = mapTiles;

GameStore.loadGameMapTiles(gameMapTiles);

//renders the game basic with React
React.renderComponent(
    GameView(), document.getElementById('board')
);

//post react rendering, characters and animation
