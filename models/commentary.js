const mongoose = require("mongoose");

// Definicion del esquema y modelo
let commentarySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    comicId:{
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    stars: {
        type: Number,
        required: true,
    },
    date: {
        type: String,
        required: false,
    }
});

let commentary = mongoose.model("commentary", commentarySchema);
module.exports = commentary;
