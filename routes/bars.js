var express = require("express");
var router  = express.Router(); // new instance of express Router in our router
var Bar     = require("../models/bar.js"); // include the model schema
var Comment = require("../models/comment.js"); // include the model schema


// INDEX: show ALL bars
router.get("/", function(req, res){
    // get all bars from database:
    Bar.find({}, function(err, allBarsFound){
        if (err) {
            console.log(err);
        } else {
            //                 {name we give it: data pased in}
            res.render("bars/index.ejs", { bars: allBarsFound });
        }
    });
}); //-------------------------------------------------------------------------

// CREATE:
router.post("/", isLoggedIn, function(req, res){
    // get data from FORM: req.body
    var name = req.body.name; // from new.ejs FORM "name"
    var image = req.body.image; // from new.ejs FORM "image"
    var desc = req.body.description; //from new.ejs FORM "description"
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    //var cost = ;
    //var rating = ;

    var newBar = {name: name, image: image, description: desc, author: author};

    // create a new bar and save to the database:
    Bar.create(newBar, function(err, newlyCreated){
        console.log("newlyCreated = " + newlyCreated);
        if (err) {
            console.log(err);
        } else {
            res.redirect("/bars"); // to GET '/bars' route
        }
    });
}); //-------------------------------------------------------------------------

// NEW: show the form to create a new bar
router.get("/new", isLoggedIn, function(req, res){
    res.render("bars/new.ejs");
}); //-------------------------------------------------------------------------

// SHOW: info of bar by ID
router.get("/:id", function(req, res){
    // find bar witgh ID:
    Bar.findById(req.params.id).populate("comments").exec(function(err, foundBar){
        if (err) {
            console.log(err);
        } else {
            // render show template with that bar data:
            res.render("bars/show.ejs", {bar: foundBar});
        }
    });
}); //-------------------------------------------------------------------------

// EDIT by ID
router.get("/:id/edit", checkBarOwnership, function(req, res){
    // checkBarOwnership MIDDLEWARE is checked THEN:
    Bar.findById(req.params.id, function(err, foundBar){
        res.render("bars/edit.ejs", { bar: foundBar });
    });
}); //-------------------------------------------------------------------------

// UPDATE by ID
router.put("/:id", checkBarOwnership, function(req, res){
    Bar.findByIdAndUpdate(req.params.id, req.body.bar, function(err, foundBar){
        if (err) {
            console.log(err);
            res.redirect("/bars");
        } else {
            res.redirect("/bars/" + req.params.id);
        }
    });
}); //-------------------------------------------------------------------------

// DESTROY by ID
router.delete("/:id", checkBarOwnership, function(req, res){
    Bar.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            console.log(err);
            res.redirect("/bars");
        } else {
            res.redirect("/bars");
        }
    });
}); //-------------------------------------------------------------------------


//=============================================================================
// our MIDDLEWARE functions ---------------------------------------------------
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) { return next(); }

    res.redirect("/login");
}; //--------------------------------------------------------------------------

function checkBarOwnership(req, res, next) {
    // is user logged in?
    if (req.isAuthenticated()) {
        Bar.findById(req.params.id, function(err, foundBar){
            if (err) {
                console.log(err);
                res.redirect("back"); // previous page
            } else {
                // does user own bar post? compare:
                console.log(foundBar.author.id); // mongoose object
                console.log(req.user._id); // string

                if (foundBar.author.id.equals(req.user._id)) {
                    //res.render("bars/edit.ejs", { bar: foundBar });
                    next();
                } else {
                    res.redirect("back"); // previous page
                }
            }
        });
    } else {
        console.log("checkBarOwnership() - YOU NEED TO BE LOGGED IN TO DO THAT!");
        res.redirect("back"); // previous page
    }
};
//=============================================================================

//-----------------------------------------------------------------------------
// export (return) our router for app.js import
module.exports = router;