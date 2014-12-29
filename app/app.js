"use strict";
var path = require('path');
var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

// Passport configurators..
var loopbackPassport = require('loopback-component-passport');
var PassportConfigurator = loopbackPassport.PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);

/*
 * body-parser is a piece of express middleware that
 *   reads a form's input and stores it as a javascript
 *   object accessible through `req.body`
 *
 */
var bodyParser = require('body-parser');


// request pre-processing middleware
app.use(loopback.compress());

// Setup the view engine (jade)
var path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// boot scripts mount components like REST API
boot(app, __dirname);

// attempt to build the providers/passport config
var config = require('./providers.js').config(app);


// to support JSON-encoded bodies
app.use(bodyParser.json());
// to support URL-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
}));

// The access token is only available after boot
app.use(loopback.token({
  model: app.models.accessToken
}));

app.use(loopback.cookieParser(app.get('cookieSecret')));
app.use(loopback.session({
  secret: app.get('sessionSecret'),
  saveUninitialized: true,
  resave: true
}));
passportConfigurator.init();

passportConfigurator.setupModels({
  userModel: app.models.user,
  userIdentityModel: app.models.userIdentity,
  userCredentialModel: app.models.userCredential
});
for (var s in config) {
  if (config.hasOwnProperty(s)) {
    var c = config[s];
    c.session = c.session !== false;
    passportConfigurator.configureProvider(s, c);
  }
}
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

app.get('/', function (req, res) {
  res.render('pages/index', {user:
    req.user,
    url: req.url
  });
});

app.get('/auth/account', ensureLoggedIn('/login'), function (req, res) {
  res.render('pages/loginProfiles', {
    user: req.user,
    url: req.url
  });
});

app.get('/link/account', ensureLoggedIn('/login'), function (req, res) {
  res.render('pages/linkedAccounts', {
    user: req.user,
    url: req.url
  });
});

app.get('/local', function (req, res){
  res.render('pages/local', {
    user: req.user,
    url: req.url
  });
});

app.get('/signup', function (req, res){
  res.render('pages/signup', {
    user: req.user,
    url: req.url
  });
});

app.get('/login', function (req, res){
  res.render('pages/login', {
    user: req.user,
    url: req.url
   });
});

app.get('/link', function (req, res){
  res.render('pages/link', {
    user: req.user,
    url: req.url
  });
});

app.get('/auth/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});


// Requests that get this far won't be handled
// by any middleware. Convert them into a 404 error
// that will be handled later down the chain.
app.use(loopback.urlNotFound());

// The ultimate error handler.
app.use(loopback.errorHandler());

// optionally start the app
app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

if (require.main === module) {
  app.start();
}
