// our MIDDLEWARE functions ---------------------------------------------------
var Bar              = require("../models/bar.js");
var Comment          = require("../models/comment.js");
var middlewareObject = {};


middlewareObject.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }

    res.redirect("/login");
}; //--------------------------------------------------------------------------



middlewareObject.checkBarOwnership = function(req, res, next) {
    // is user logged in?
    if (req.isAuthenticated()) {
        Bar.findById(req.params.id, function(err, foundBar){
            if (err) {
                console.log(err);
                res.redirect("back"); // previous page
            } else {
                // does user own bar post? compare:
                console.log("foundBar.author.id = " + foundBar.author.id); // mongoose object
                console.log("req.user._id = " + req.user._id); // string

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
}; //--------------------------------------------------------------------------



middlewareObject.checkCommentOwnership = function(req, res, next) {
    // is user logged in?
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                console.log(err);
                res.redirect("back"); // previous page
            } else {
                // does user own bar post? compare:
                console.log(foundComment.author.id); // mongoose object
                console.log(req.user._id); // string

                if (foundComment.author.id.equals(req.user._id)) {
                    //res.render("bars/edit.ejs", { bar: foundBar });
                    next();
                } else {
                    res.redirect("back"); // previous page
                }
            }
        });
    } else {
        console.log("checkCommentOwnership() - YOU NEED TO BE LOGGED IN TO DO THAT!");
        res.redirect("back"); // previous page
    }
}; //--------------------------------------------------------------------------



// export the middleware function object:
module.exports = middlewareObject;
// our MIDDLEWARE functions ---------------------------------------------------
