var mongoose = require("mongoose");

// SCHEMA SETUP:
var barSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
// complile into a model:
var Bar = mongoose.model("Bar", barSchema);

// export the model:
module.exports = mongoose.model("Bar", barSchema);
