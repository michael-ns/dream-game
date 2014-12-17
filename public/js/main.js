var React = require('react');

var Game = React.createClass({

  render: function() {
    return (
      <div className="row">
        {tiles}
      </div>
    )
  }
});



module.exports = Game;

React.renderComponent(
  Game(), document.getElementById('board')
);


// var React = require('react');
// var Router = require('react-router-component');
// var Locations = Router.Locations;
// var Location = Router.Location;
// var Link = ReactRouter.Link;

// var Menu = require('./components/menu');
// var Map = require('./components/map');

// var Game = React.createClass({

//   render: function(){
//     return (
//       <div>
//         //<Locations>
//         //  <Location path="/" handler={Menu} />
//         //  <Location path="/level" handler={Map} />
//         //</Locations>
//       </div>
//     );
//   }
// });

// React.renderComponent(Game, document.getElementById('board'));