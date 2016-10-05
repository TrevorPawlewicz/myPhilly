var express    = require("express");
var router     = express.Router(); //new instance of express Router in our router
var passport   = require("passport");
var User       = require("../models/user.js"); // include the model schema


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
}); //-------------------------------------------------------------------------


// handle (POST) Sign Up logic:
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, thisUser){
        if (err) {
            req.flash("error", err.message);
            res.render("register.ejs");
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome " + user.username + "!");
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
        failureRedirect: "/login",
        failureFlash: true
    }),
    function(req, res){
        // not really needed
        console.log("something really went wrong :(");
    }
); //------------------------------------------------------------------------


// (GET) Logout logic
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged You Out!");
    //res.redirect("/");
    res.redirect("/bars");
}); //------------------------------------------------------------------------


//-----------------------------------------------------------------------------
// export (return) our router for app.js import
module.exports = router;
