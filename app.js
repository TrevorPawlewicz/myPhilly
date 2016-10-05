var express        = require("express");
var app            = express();
var bodyParser     = require("body-parser");
var mongoose       = require("mongoose");
var flash          = require("connect-flash"); // messages
var passport       = require("passport");
var LocalStrategy  = require("passport-local");
var methodOverride = require("method-override");

//  Schemas                  ./ = current directory
var Bar           = require("./models/bar.js");
var Comment       = require("./models/comment.js");
var User          = require("./models/user.js");

var seedDB        = require("./seeds.js"); // for seeding the database with data

// ROUTES - require the files, then app.use them below
var commentRoutes = require("./routes/comments.js"),
    barRoutes     = require("./routes/bars.js"),
    indexRoutes   = require("./routes/index.js"); // AUTHENTICATION
//-----------------------------------------------------------------------------


mongoose.connect("mongodb://localhost/my_philly");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
// __dirname is the directory the app.js live in
app.use(express.static(__dirname + "/public")); //points Express to public folder
app.use(methodOverride("_method"));
app.use(flash());

//seedDB(); // call function to seed data

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

// our MIDDLEWARE for ALL routes:
app.use(function(req, res, next){
    // res.locals = available in ALL our ejs templates
    res.locals.currentUser = req.user;
    res.locals.errorMsg = req.flash("error"); // flash message KEY
    res.locals.successMsg = req.flash("success"); // flash message KEY
    next(); // needed to move out of MIDDLEWARE
});

// associate routes with Express:
app.use(indexRoutes);
app.use("/bars", barRoutes); // adds "/bars" prefix to routes (get, post)
app.use(commentRoutes);
//-----------------------------------------------------------------------------

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ROUTES moved to:
    // commentRoutes = require("./routes/comments.js"),
    // barRoutes     = require("./routes/bars.js"),
    // indexRoutes   = require("./routes/index.js"); // AUTHENTICATION
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//=============================================================================
// SERVER
var port = process.env.PORT || 3000;
app.listen(port, process.env.IP, function() {
    console.log("----> myPhilly Server has started on port: " + port);
});
//=============================================================================
