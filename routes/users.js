/**
 * Created by suzanne on 11/9/16.
 */
// app/routes.js
module.exports = function(app, passport) {

//sends user object of logged in, otherwise
//
//var currentUser = function(req, res ,next){
//    //if user is authenticated, carry on
//    if (req.isAuthenticated()) {
//      next();
//    } else {
//      //otherwise set the user object name/id to "guest"
//      req.guest = "Guest";
//      next();
//    }
//  };
//
//  app.use(currentUser);

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', function(req, res) {
    //console.log(req);

    res.render('pages/index.ejs', {
      user : req.user  // get the user out of session and pass to template

    }); // load the index.ejs file
  });

  //
  //  ABOUT PAGE (with user stories)
  //
  app.get('/about', function(req, res) {
    res.render('pages/about.ejs', {
      user : req.user  // get the user out of session and pass to template

    }); // load the index.ejs file
  });


  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get('/login', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('pages/login.ejs', {
      message: req.flash('loginMessage'),
      user : req.user  // get the user out of session and pass to template
    });
  });

  // process the login form
  // app.post('/login', do all our passport stuff here);

  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get('/signup', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('pages/signup.ejs', {
      message: req.flash('signupMessage'),
      user : req.user  // get the user out of session and pass to template
    });
  });

  // process the signup form
  // app.post('/signup', do all our passport stuff here);
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));


  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // =====================================
  // DASHBOARD SECTION =====================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/dashboard', isLoggedIn, function(req,res){
    res.render('pages/dashboard.ejs', {
      user: req.user
    });
  });


  // =====================================
  // PROFILE SECTION =====================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('pages/profile.ejs', {
      user : req.user // get the user out of session and pass to template
    });
  });

  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });



// =====================================
  // FACEBOOK ROUTES =====================
  // =====================================
  // route for facebook authentication and login
  app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect : '/profile',
      failureRedirect : '/'
    }));



// =====================================
  // GOOGLE ROUTES =======================
  // =====================================
  // send to google to do the authentication
  // profile gets us their basic information including their name
  // email gets their emails
  app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

  // the callback after google has authenticated the user
  app.get('/auth/google/callback',
    passport.authenticate('google', {
      successRedirect : '/profile',
      failureRedirect : '/'
    }));
// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

  // locally --------------------------------
  app.get('/connect/local', function(req, res) {
    res.render('pages/connect-local.ejs', { message: req.flash('loginMessage') });
  });
  app.post('/connect/local', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // facebook -------------------------------

  // send to facebook to do the authentication
  app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

  // handle the callback after facebook has authorized the user
  app.get('/connect/facebook/callback',
    passport.authorize('facebook', {
      successRedirect : '/profile',
      failureRedirect : '/'
    }));


  // google ---------------------------------

  // send to google to do the authentication
  app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

  // the callback after google has authorized the user
  app.get('/connect/google/callback',
    passport.authorize('google', {
      successRedirect : '/profile',
      failureRedirect : '/'
    }));


// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

// local -----------------------------------
app.get('/unlink/local', function(req, res) {
  var user            = req.user;
  user.local.email    = undefined;
  user.local.password = undefined;
  user.save(function(err) {
    res.redirect('/profile');
  });
});

// facebook -------------------------------
app.get('/unlink/facebook', function(req, res) {
  var user            = req.user;
  user.facebook.token = undefined;
  user.save(function(err) {
    res.redirect('/profile');
  });
});


// google ---------------------------------
app.get('/unlink/google', function(req, res) {
  var user          = req.user;
  user.google.token = undefined;
  user.save(function(err) {
    res.redirect('/profile');
  });
});

};
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

