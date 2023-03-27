const mongoose = require("mongoose");

// Definicion del esquema y modelo
let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
    },
    avatar: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "user", "api"],
        required: true,
    }
});

let user = mongoose.model("user", userSchema);
module.exports = user;
