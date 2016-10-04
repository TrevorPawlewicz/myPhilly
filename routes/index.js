var express  = require("express");
var router   = express.Router(); // new instance of express Router in our router
var passport = require("passport");
var User     = require("../models/user.js"); // include the model schema

// Root Route
router.get("/", function(req, res){
    res.render("landing.ejs");
}); //-------------------------------------------------------------------------


// ============================================================================
// AUTH ROUTES
//---------------

// SHOW (GET) the form
router.get("/register", function(req, res){
    res.render("register.ejs");
});

// handle (POST) Sign Up logic:
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, thisUser){
        if (err) {
            console.log(err);
            res.render("register.ejs");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/bars");
            });
        }
    });
}); //-------------------------------------------------------------------------


// SHOW (GET) Login form:
router.get("/login", function(req, res){
    res.render("login.ejs");
}); //-------------------------------------------------------------------------

// handle (POST) Login with "passport-local-mongoose" MIDDLEWARE:
router.post("/login", passport.authenticate("local",
    {   // user is assumed to exist
        successRedirect: "/bars",
        failureRedirect: "/login"
    }),
    function(req, res){
        // not really needed
}); //------------------------------------------------------------------------


// (GET) Logout logic
router.get("/logout", function(req, res){
    req.logout();
    //res.redirect("/");
    res.redirect("/bars");
}); //------------------------------------------------------------------------


// our MIDDLEWARE functions --------------------------------------------------
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) { return next(); }

    res.redirect("/login");
}; //--------------------------------------------------------------------------



//-----------------------------------------------------------------------------
// export (return) our router for app.js import
module.exports = router;
