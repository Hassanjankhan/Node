const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    image: { type: String },
    place: { type: String, required: true },
})
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
