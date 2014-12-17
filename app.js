// server.js
// load the things we need
var express = require('express');
var app = express();

//set public directory for assets management
app.use(express.static(__dirname + '/public'));

// set the view engine to ejs
app.set('view engine', 'ejs');

// game menu page routing
app.get('/', function(req, res) {
  res.render('index');
});

//game level page routing
app.get('/level', function(req, res) {
  res.render('level');
});



app.listen(8080);
console.log('8080 is the magic port');