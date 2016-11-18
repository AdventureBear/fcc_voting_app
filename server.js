
var express = require('express');
var mongodb = require('mongodb');
var dotenv = require('dotenv');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

//setup express application
var app = express();
app.use(morgan('dev')); //log every request to console
app.use(cookieParser()); //read cookies
app.use(bodyParser()); //read forms

//templating engines
//app.use(express.static('.'));
app.set('view engine', 'ejs'); //set up ejs for templating

app.set('port', (process.env.PORT || 5000));
dotenv.config();

//required for passport
app.use(session({ secret: 'ilovescotchscotch'})); //session secrets
app.use(passport.initialize());
app.use(passport.session()); //persistent login sessions
app.use(flash());  //use connect-flash for flash messages stored in session

require('./config/passport')(passport); // pass passport for configuration


//routes
require('./routes/index.js')(app, passport);
//require('./routes/routes.js')(app, passport);  // load our routes and pass in our app and fully configured passport


//var MongoClient = mongodb.MongoClient;

//configuration
// Connection URL. This is where your mongodb server is running.
// For locally running connection
//var url = 'mongodb://localhost:27017/urlshortener';
var url = process.env.MONGOLAB_URI;
mongoose.connect(url);

//// Use connect method to connect to the Server
//MongoClient.connect(url, function (err, db) {
//  if (err) {
//    console.log('Unable to connect to the mongoDB server. Error:', err);
//  } else {
//    console.log('Connection established to database');

    // do some work here with the database.
    //app.get('/', function (req, res) {
    //  //res.send(index.html);
    //  res.render('index.ejs');
    //});


    //Create the server connection
    app.listen(app.get('port'), function () {
      console.log('Node app is running on port', app.get('port'));
    });

  //
  //  //Close connection
  //  db.close;
  //}

//});