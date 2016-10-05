// our MIDDLEWARE functions ---------------------------------------------------
var Bar              = require("../models/bar.js");
var Comment          = require("../models/comment.js");
var middlewareObject = {};


middlewareObject.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    //  flash( key,      value) to be passed
    req.flash("error", "You Need To Be Logged In To Do That!");
    res.redirect("/login");
}; //--------------------------------------------------------------------------


middlewareObject.checkBarOwnership = function(req, res, next) {
    // is user logged in?
    if (req.isAuthenticated()) {
        Bar.findById(req.params.id, function(err, foundBar){
            if (err) {
                console.log(err);
                req.flash("error", "Whaaaaa? Bar not Found!");
                res.redirect("back"); // previous page
            } else {
                // does user own bar post? compare:
                console.log("foundBar.author.id = " + foundBar.author.id); // mongoose object
                console.log("req.user._id = " + req.user._id); // string

                if (foundBar.author.id.equals(req.user._id)) {
                    req.flash("error", "You Do Not Have Permission To Do That, Son!");
                    next();
                } else {
                    res.redirect("back"); // previous page
                }
            }
        });
    } else {
        req.flash("error", "You Need To Be Logged In To Do That!");
        res.redirect("back"); // previous page
    }
}; //--------------------------------------------------------------------------


middlewareObject.checkCommentOwnership = function(req, res, next) {
    // is user logged in?
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                console.log(err);
                req.flash("error", "Whaaaaa? Comment not Found!");
                res.redirect("back"); // previous page
            } else {
                // does user own bar post? compare:
                console.log(foundComment.author.id); // mongoose object
                console.log(req.user._id); // string

                if (foundComment.author.id.equals(req.user._id)) {
                    req.flash("error", "You Do Not Have Permission To Do That, Son!");
                    next();
                } else {
                    res.redirect("back"); // previous page
                }
            }
        });
    } else {
        req.flash("error", "You Need To Be Logged In To Do That!");
        res.redirect("back"); // previous page
    }
}; //--------------------------------------------------------------------------


// export the middleware function object:
module.exports = middlewareObject;
// our MIDDLEWARE functions ---------------------------------------------------
