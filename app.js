var express       = require("express");
var app           = express();
var bodyParser    = require("body-parser");
var mongoose      = require("mongoose");
var passport      = require("passport");
var LocalStrategy = require("passport-local");

//                           ./ = current directory
var Bar           = require("./models/bar.js");
var Comment       = require("./models/comment.js");
var User          = require("./models/user.js");
var seedDB        = require("./seeds.js");


mongoose.connect("mongodb://localhost/my_philly");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
// __dirname is the directory the app.js live in
app.use(express.static(__dirname + "/public")); //points Express to public folder

seedDB(); // call function to seed data

// PASSPORT Config: -----------------------------------------------------------
app.use(require("express-session")({
    secret: "Everybody wants some!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//-----------------------------------------------------------------------------


// ROUTES:
app.get("/", function(req, res){
    res.render("landing.ejs");
}); //-------------------------------------------------------------------------

// INDEX: show ALL bars
app.get("/bars", function(req, res){
    // get all bars from database:
    Bar.find({}, function(err, allBarsFound){
        if (err) {
            console.log(err);
        } else {
            //                {name we give it: data pased in}
            res.render("bars/index.ejs", {bars: allBarsFound});
        }
    });
}); //-------------------------------------------------------------------------

// CREATE:
app.post("/bars", function(req, res){
    // get data from FORM...
    var name = req.body.name; // taken from new.ejs FORM "name"
    var image = req.body.image; // taken from new.ejs FORM "image"
    var desc = req.body.description; //from new.ejs FORM "description"
    //var cost = ;
    //var rating = ;
    var newBar = {name: name, image: image, description: desc};
    // create a new bar and save to the database:
    Bar.create(newBar, function(err, newlyCreated){
        if (err) {
            console.log(err);
        } else {
            res.redirect("/bars"); // to GET '/bars' route
        }
    });
}); //-------------------------------------------------------------------------

// NEW: show the form to create a new bar
app.get("/bars/new", function(req, res){
    res.render("bars/new.ejs");
}); //-------------------------------------------------------------------------

// SHOW: info of bar by ID
app.get("/bars/:id", function(req, res){
    // find bar witgh ID:
    Bar.findById(req.params.id).populate("comments").exec(function(err, foundBar){
        if (err) {
            console.log(err);
        } else {
            // render show template with that bar data:
            res.render("bars/show.ejs", {bar: foundBar});
        }
    });
});


// ============================================================================
// COMMENT ROUTES
//---------------
// (GET)                          MIDDLEWARE
app.get("/bars/:id/comments/new", isLoggedIn, function(req, res){
    Bar.findById(req.params.id, function(err, bar){
        if (err) {
            console.log(err);
        } else {
            //                 pass data to the form
            res.render("comments/new.ejs", {bar: bar});
        }
    });
});

// POST comment                MIDDLEWARE
app.post("/bars/:id/comments", isLoggedIn, function(req, res){
    Bar.findById(req.params.id, function(err, bar){
        if (err) {
            console.log(err);
            res.redirect("/bars");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    console.log(err);
                } else {
                    //console.log("comment = " + comment);
                    bar.comments.push(comment);
                    bar.save();
                    res.redirect("/bars/" + bar._id);
                }
            });
        }
    });
});

// ============================================================================
// AUTH ROUTES
//---------------

// SHOW (GET) the form
app.get("/register", function(req, res){
    res.render("register.ejs");
});

// handle (POST) Sign Up logic:
app.post("/register", function(req, res){
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
app.get("/login", function(req, res){
    res.render("login.ejs");
});

// handle (POST) Login with "passport-local-mongoose" MIDDLEWARE:
app.post("/login", passport.authenticate("local",
    {   // user is assumed to exist
        successRedirect: "/bars",
        failureRedirect: "/login"
    }),
    function(req, res){
        // not really needed
}); //------------------------------------------------------------------------




// (GET) Logout logic
app.get("/logout", function(req, res){
    req.logout();
    //res.redirect("/");
    res.redirect("/bars");
}); //------------------------------------------------------------------------


// our MIDDLEWARE functions
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) { return next(); }

    res.redirect("/login");
};




//=============================================================================
// SERVER
var port = process.env.PORT || 3000;
app.listen(port, process.env.IP, function() {
    console.log("----> myPhilly Server has started on port: " + port);
});
//=============================================================================
