var mongoose = require("mongoose");

// SCHEMA SETUP:
var barSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {   // associate comments with bar
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    date: String,
    cost: String,
    rating: String
});
// compile into a model:
var Bar = mongoose.model("Bar", barSchema);

// export the model:
module.exports = mongoose.model("Bar", barSchema);
