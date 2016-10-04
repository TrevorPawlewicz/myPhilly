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
router.post("/", function(req, res){
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
router.get("/new", function(req, res){
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

//-----------------------------------------------------------------------------
// export (return) our router for app.js import
module.exports = router;
