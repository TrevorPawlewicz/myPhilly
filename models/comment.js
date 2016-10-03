var mongoose = require("mongoose");

// SCHEMA SETUP:
var commentSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
// complile into a model:
var Comment = mongoose.model("Bar", CommentSchema);

// export the model:
module.exports = mongoose.model("Bar", CommentSchema);
