var mongoose = require("mongoose");

// SCHEMA SETUP:
var commentSchema = mongoose.Schema({
    text: String,
    author: String
});

// export the model:
module.exports = mongoose.model("Comment", commentSchema);
