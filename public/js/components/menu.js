var React = require('react');

var levelList = require('../../map/level-list.json');

var Menu = React.createClass({
  
  render: function() {
    var level = levelList.levelList.map(function(level){
      return <option value={level}>{level}</option>
    });

    return (
      <div className="menu">
        <select className="level-dropdown">
          {level}
        </select>
      </div>
    )
  }

});

module.exports = Menu;





// var MapActionCreators = require('./actions/mapActionCreators');
// var DashboardActionCreators = require('./actions/dashboardActionCreators');
// var ChampActionCreators = require('./actions/champActionCreators');
// var CreepActionCreators = require('./actions/creepActionCreators');

// var Map = require('./components/map');
// var Dashboard = require('./components/dashboard');
// var Champ = require('./components/champ');
// var CreepOne = require('./components/creepOne');
// var CreepTwo = require('./components/creepTwo');

// var ChampStore = require('./stores/champStore');
// var CreepStore = require('./stores/creepStore');
// var MapStore = require('./stores/mapStore');

// var Menu = React.createClass({
  
//   render: function() {
//     return (
//       <div className="game-wrapper" onKeyPress={this.onKeyPress}>
//         <div className="map"><Map /></div>
//         <div><button className="start-btn" onClick={this.onClickStartGame}>Game Start</button></div>
//         <div id="dashboard"></div> 
//       </div>
//     )
//   }

// });

// module.exports = Menu;





// var ce = require('cloneextend');
// var $ = require('jquery');

// var MapActionCreators = require('./actions/mapActionCreators');
// var DashboardActionCreators = require('./actions/dashboardActionCreators');
// var ChampActionCreators = require('./actions/champActionCreators');
// var CreepActionCreators = require('./actions/creepActionCreators');

// var Map = require('./components/map');
// var Dashboard = require('./components/dashboard');
// var Champ = require('./components/champ');
// var CreepOne = require('./components/creepOne');
// var CreepTwo = require('./components/creepTwo');

// var ChampStore = require('./stores/champStore');
// var CreepStore = require('./stores/creepStore');
// var MapStore = require('./stores/mapStore');


// var Game = React.createClass({
//   onKeyPress: function(e) {
//     var keyCode = e.which;

//     ChampActionCreators.handleKeyPress(keyCode);
//   },

//   onClickStartGame: function(e) {

//     var gameObjects = MapStore.getGameObjects();

//     gameObjects.keys(hash).forEach(function (key) {
//       var current_object = hash[key];

//       switch(key) {
//         case "champ":
//           $('#dashboard').after('<div id="champ"></div>');

//           React.renderComponent(
//             Champ(), document.getElementById('champ')
//           );

//           break;

//         case "creep":
//           CreepStore.addNewCreep(current_object);




//           _champFaceDirection = "down";
//           break;

//         case 97:
//           _champFaceDirection = "left";
//           break;

//         case 100:
//           _champFaceDirection = "right";
//           break;

//         default:
//           break;
//       }

//       React.renderComponent(
//         Champ(), document.getElementById('champ')
//       );
//     })




//     React.renderComponent(
//       Champ(), document.getElementById('champ')
//     );

//     React.renderComponent(
//       CreepOne(), document.getElementById('creep-one')
//     );

//     React.renderComponent(
//       CreepTwo(), document.getElementById('creep-two')
//     );

//     React.renderComponent(
//       Dashboard(), document.getElementById('dashboard')
//     );

//     ChampStore.startChampAnimationLoop();
//     CreepStore.startCreepAnimationLoop();
//   },

//   render: function() {
//     return (
//       <div className="game-wrapper" onKeyPress={this.onKeyPress}>
//         <div className="map"><Map /></div>
//         <div><button className="start-btn" onClick={this.onClickStartGame}>Game Start</button></div>
//         <div id="dashboard"></div> 
//       </div>
//     )
//   }
// });

// module.exports = Game;

// React.renderComponent(
//   Game(), document.getElementById('board')
// );