const mongoose = require("mongoose");

// Definicion del esquema y modelo
let usuarioSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    password: {
        type: String,
    },
    avatar: {
        type: String,
    },
});

let user = mongoose.model("user", usuarioSchema);

module.exports = user;
