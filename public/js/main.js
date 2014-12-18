var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
var DefaultRoute = Router.DefaultRoute;

var Menu = require('./components/menu');
var Level = require('./components/level');
var ChampAcionCreators = require('./actions/champActionCreators');


var Game = React.createClass({

  render: function(){
    return (
      <div className="wrapper">
        <RouteHandler/>
      </div>
    );
  }
});

module.exports = Game;

var routes = (
  <Route path="/" handler={Game}>
    <DefaultRoute handler={Menu}/>
    <Route name="level" path="/level" handler={Level}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('board'));
});