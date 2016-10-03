var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");



var bars = [
    {name: "Bigfoot Lodge", image: "http://www.imaginelifestyles.com/luxuryliving/wp-content/uploads/blog/files/u2/PetesSake.jpg"},
    {name: "Dive Bar", image: "http://philadelphia.cities2night.com/public/article_images/129.jpg"},
    {name: "Paddy's Pub", image: "http://www.sitcomsonline.com/photopost/data/1315/its-always-sunny-in-philadelphia-paddy.jpg"}
];


// ROUTES:
app.get("/", function(req, res){
    res.render("landing.ejs");
});
// show ALL bars
app.get("/bars", function(req, res){
    //                      {name we give it: data pased in}
    res.render("bars.ejs", {bars: bars});
});


app.post("/bars", function(req, res){
    // get data from FORM...
    var name = req.body.name; // taken from new.ejs FORM "name"
    var image = req.body.image; // taken from new.ejs FORM "image"

    var newBar = {name: name, image: image};
    bars.push(newBar); //...and add to bars array:

    res.redirect("bars");
});

// show the form
app.get("/bars/new", function(req, res){
    res.render("new.ejs");
});














// server
var port = process.env.PORT || 3000;
app.listen(port, process.env.IP, function() {
    console.log("----> Server has started on port: " + port);
});
