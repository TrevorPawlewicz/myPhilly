var express    = require("express");
var router     = express.Router({mergeParams: true}); //bars + comments get merged
var Bar        = require("../models/bar.js"); // include the model schema
var Comment    = require("../models/comment.js"); // include the model schema
var middleware = require("../middleware/middleware.js"); // include our MIDDLEWARE

// ============================================================================
// COMMENT ROUTES
//---------------
// NEW (GET)                         MIDDLEWARE
router.get("/bars/:id/comments/new", middleware.isLoggedIn, function(req, res){
    Bar.findById(req.params.id, function(err, bar){
        if (err) {
            console.log(err);
        } else {
            //             pass data to the form -v-
            res.render("comments/new.ejs", {bar: bar});
        }
    });
}); //-------------------------------------------------------------------------


// CREATE (POST) comment          MIDDLEWARE
router.post("/bars/:id/comments", middleware.isLoggedIn, function(req, res){
    Bar.findById(req.params.id, function(err, bar){
        if (err) {
            console.log(err);
            res.redirect("/bars");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err) {

                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    bar.comments.push(comment);
                    bar.save();
                    console.log("---> comment = " + comment);
                    res.redirect("/bars/" + bar._id);
                }
            });
        }
    });
}); //-------------------------------------------------------------------------


// EDIT comment by Id
router.get("/bars/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {bar_id: req.params.id, comment: foundComment});
        }
    });
}); //-------------------------------------------------------------------------


// UPDATE comment
router.put("/bars/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){

    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err) {
            res.redirect("back");
        } else {
            //req.flash("success", "Comment Updated!");
            res.redirect("/bars/" + req.params.id);
        }
    });
}); //-------------------------------------------------------------------------


// DELETE comment
router.delete("/bars/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err) {
            res.redirect("back");
        } else {
            //req.flash("success", "Comment Deleted!");
            res.redirect("/bars/" + req.params.id);
        }
    });
}); //-------------------------------------------------------------------------



//-----------------------------------------------------------------------------
// export (return) our router for app.js import
module.exports = router;
