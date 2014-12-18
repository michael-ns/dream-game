var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
var DefaultRoute = Router.DefaultRoute;

var Menu = require('./components/menu');
var Level = require('./components/level');


var Game = React.createClass({

  render: function(){
    return (
      <div>
        <RouteHandler/>
      </div>
    );
  }
});

var routes = (
  <Route path="/" handler={Game}>
    <DefaultRoute handler={Menu}/>
    <Route name="level" path="/level" handler={Level}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('board'));
});