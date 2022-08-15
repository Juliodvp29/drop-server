const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    name: String,
    path: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Image", ImageSchema);