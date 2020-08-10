var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var { Users } = require("./src/models");
var jsonwebtoken = require('jsonwebtoken')

const rootIndex = require('./src/routes/index')
const routerAuthor = require('./src/routes/author')
const routerPost = require('./src/routes/post')
const routerComment = require('./src/routes/comment')


// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';
//opts.issuer = 'accounts.examplesoft.com';
//opts.audience = 'yoursite.net';
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {

  Users.findById(jwt_payload.id, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));

passport.use(new Strategy(
  function(username, password, cb) {
    Users.findOne(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  Users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});




// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(express.json())
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });
  
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
  
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

app.get('/jwt', passport.authenticate("jwt"), (req, res) => {
  res.json({
    user: "tes",
    data: req.user
  })
})

app.post("/login", async (req, res) => {
  const {username, password} = req.body

  Users.findOne(username, function(err, user) {
    if (err) { return res.json({error: "yes"}); }
    if (!user) { return res.json({error: "yes"}); }
    if (user.password != password) { res.json({error: "yes"}); }
    const token = jsonwebtoken.sign(user, opts.secretOrKey);
    res.json({
      status : "success",
      token: token
    })
  });

})

app.use('/', rootIndex)
app.use('/author', passport.authenticate('jwt', { session: false }), routerAuthor)
app.use('/post', passport.authenticate('jwt', { session: false }), routerPost)
app.use('/comment', passport.authenticate('jwt', { session: false }), routerComment)


app.listen(3000);
