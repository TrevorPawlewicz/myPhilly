// routes/bars.js
var express    = require("express");
var router     = express.Router(); // new instance of express Router
var Bar        = require("../models/bar.js"); // include the model schema
var middleware = require("../middleware/middleware.js"); // include our MIDDLEWARE
var moment     = require("moment"); // for time & date display
//var multer     = require("multer"); // file image upload
//var imageUpload = multer({dest: "./public/images/uploads"});


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
 router.post("/", middleware.isLoggedIn, function(req, res){
//router.post("/", middleware.isLoggedIn, upload.single("image") , function(req, res){
    // get data from FORM: req.body
    var name = req.body.name; // from new.ejs FORM "name"
    var image = req.body.image; // from new.ejs FORM "image"
    var desc = req.body.description; //from new.ejs FORM "description"
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var creationDate = moment().format("MMMM Do YYYY, h:mm a");
    //var cost = ;
    //var rating = ;

    var newBar = {name: name, image: image, description: desc, author: author, date: creationDate};

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
router.get("/new", middleware.isLoggedIn, function(req, res){
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
router.get("/:id/edit", middleware.checkBarOwnership, function(req, res){
    // checkBarOwnership MIDDLEWARE is checked THEN:
    Bar.findById(req.params.id, function(err, foundBar){
        res.render("bars/edit.ejs", { bar: foundBar });
    });
}); //-------------------------------------------------------------------------


// UPDATE by ID
router.put("/:id", middleware.checkBarOwnership, function(req, res){
    Bar.findByIdAndUpdate(req.params.id, req.body.bar, function(err, foundBar){
        if (err) {
            console.log(err);
            res.redirect("/bars");
        } else {
            req.flash("success", "Bar Updated!!");
            res.redirect("/bars/" + req.params.id);
        }
    });
}); //-------------------------------------------------------------------------


// DESTROY by ID
router.delete("/:id", middleware.checkBarOwnership, function(req, res){
    Bar.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            console.log(err);
            res.redirect("/bars");
        } else {
            req.flash("success", "Bar Deleted!");
            res.redirect("/bars");
        }
    });
}); //-------------------------------------------------------------------------


//-----------------------------------------------------------------------------
// export (return) our router for app.js import
module.exports = router;
