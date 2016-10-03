var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");

mongoose.connect("mongodb://localhost/my_philly");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


// SCHEMA SETUP:
var barSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
// complile into a model:
var Bar = mongoose.model("Bar", barSchema);

// // temp: -------------------------------------------------------------------
// Bar.create({
//     name: "Dive Bar",
//     image: "http://philadelphia.cities2night.com/public/article_images/129.jpg",
//     description: "get hammered!!!!"
// }, function(err, bar){
//     if (err) {
//         console.log("====> Error: " + err);
//     } else {
//         console.log("====> NEW BAR CREATED:");
//         console.log(bar);
//     }
// });

// var bars = [
//     {name: "Bigfoot Lodge", image: "http://www.imaginelifestyles.com/luxuryliving/wp-content/uploads/blog/files/u2/PetesSake.jpg"},
//     {name: "Dive Bar", image: "http://philadelphia.cities2night.com/public/article_images/129.jpg"},
//     {name: "Paddy's Pub", image: "http://www.sitcomsonline.com/photopost/data/1315/its-always-sunny-in-philadelphia-paddy.jpg"}
// ];
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
            //          {name we give it: data pased in}
            res.render("index.ejs", {bars: allBarsFound});
        }
    });
}); //-------------------------------------------------------------------------

// CREATE:
app.post("/bars", function(req, res){
    // get data from FORM...
    var name = req.body.name; // taken from new.ejs FORM "name"
    var image = req.body.image; // taken from new.ejs FORM "image"
    var desc = req.body.description; //from new.ejs FORM "description"
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
    res.render("new.ejs");
}); //-------------------------------------------------------------------------

// SHOW: info of bar by ID
app.get("/bars/:id", function(req, res){
    // find bar witgh ID:
    Bar.findById(req.params.id, function(err, foundBar){
        if (err) {
            console.log(err);
        } else {
            res.render("show.ejs", {bar: foundBar});
        }
    });
});










//=============================================================================
// SERVER
var port = process.env.PORT || 3000;
app.listen(port, process.env.IP, function() {
    console.log("----> Server has started on port: " + port);
});
//=============================================================================
