// require package dependencies:
var express        = require("express");
var app            = express();
var bodyParser     = require("body-parser");
var mongoose       = require("mongoose");
var flash          = require("connect-flash"); // messages
var passport       = require("passport"); // authentication
var LocalStrategy  = require("passport-local"); // authentication
var methodOverride = require("method-override"); //for routes
var moment         = require("moment"); // date & time

//  SCHEMAS                  ./ = current directory
var Bar           = require("./models/bar.js");     // import model
var Comment       = require("./models/comment.js"); // import model
var User          = require("./models/user.js");    // import model

var seedDB        = require("./seeds.js"); // for seeding the database with data

// ROUTES - require the files, then app.use them below
var commentRoutes = require("./routes/comments.js"),
    barRoutes     = require("./routes/bars.js"),
    indexRoutes   = require("./routes/index.js"); // AUTHENTICATION
//-----------------------------------------------------------------------------

var PORT = process.env.PORT || 3000;

// DATABASE:
//mongoose.connect("mongodb://localhost/my_philly"); // localhost:3000 database
// ------------v
// from commandline create env. var: export DATABASE_URL=mongodb://localhost/my_philly
// to create OUR enviornment variable "DATABASE_URL" (use in Heroku)
var url = process.env.DATABASE_URL || 'mongodb://localhost/my_philly';
console.log("-----> DATABASE_URL = " + process.env.DATABASE_URL);
mongoose.connect(url);
// Heroku env. var set at its website = Settings


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
app.listen(PORT, process.env.IP, function(req, res) {
    console.log("----> myPhilly Server has started on port: " + PORT);
});
//=============================================================================
