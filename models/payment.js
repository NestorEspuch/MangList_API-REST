const mongoose = require("mongoose");

// Definicion del esquema y modelo
let paymentSchema = new mongoose.Schema({
    idUser: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    mail: {
        type: String,
        required: true,
    },
    methodPayment: {
        type: String,
        required: true,
    },
});

let payment = mongoose.model("payment", paymentSchema);
module.exports = payment;
