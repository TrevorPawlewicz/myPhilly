var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");

//                        ./ = current directory
var Bar        = require("./models/bar.js");
var Comment    = require("./models/comment.js");
var seedDB     = require("./seeds.js");


mongoose.connect("mongodb://localhost/my_philly");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

seedDB(); // call function to seed data

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

app.get("/bars/:id/comments/new", function(req, res){
    Bar.findById(req.params.id, function(err, bar){
        if (err) {
            console.log(err);
        } else {
            //                 pass data to the form
            res.render("comments/new.ejs", {bar: bar});
        }
    });
});

app.post("/bars/:id/comments", function(req, res){
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


//=============================================================================
// SERVER
var port = process.env.PORT || 3000;
app.listen(port, process.env.IP, function() {
    console.log("----> myPhilly Server has started on port: " + port);
});
//=============================================================================
