const pdf = require("html-pdf");
const nodemailer = require("nodemailer");
const express = require("express");
const fs = require("fs");

const Payment = require("../models/payment.js");
let User = require("../models/user.js");

let router = express.Router();

router.post("/", async (req, res) => {
    let paymentData = new Payment({
        idUser: req.body.idUser,
        date: (new Date).toUTCString(),
        amount: req.body.amount,
        methodPayment: req.body.methodPayment,
    });
    User.findByIdAndUpdate(paymentData.idUser, {
        $set: {
            role: "subscribed"
        },
    }, {
        new: true,
        runValidators: true,
    }).then((user) => {
        paymentData.mail = user.email;
        paymentData.name = user.name;
        generateAndSendInvoice(paymentData).then(() => res.status(200).send({ ok: true, result: "Factura generada y enviada correctamente" }))
            .catch(error => res.status(200).send({ ok: true, result: "Error al generar o enviar la factura: " + error }));
    }).catch((e) => {
        res.status(500).send({ ok: false, result: "Usuario no encontrado: " + e });
    });

});

async function generateAndSendInvoice(paymentData) {
    // Crear el documento PDF
    const html = `
    <h1>Factura</h1>
    <p>Usuario: ${paymentData.name}</p>
    <p>Fecha: ${paymentData.date}</p>
    <p>Importe: ${paymentData.amount}</p>
    <p>Correo electrónico: ${paymentData.mail}</p>
    <p>Método de pago: ${paymentData.methodPayment}</p>
`;

    // Generar el PDF a partir del contenido HTML
    pdf.create(html).toFile("factura.pdf", function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log(res);

            // Leer el archivo PDF generado
            const pdfData = fs.readFileSync("factura.pdf");

            // Configurar el transporte de correo electrónico
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                post: 587,
                auth: {
                    user: "info.manglist@gmail.com",
                    pass: "zsdxowdmmpkvgnlc"
                }
            });

            // Configurar el mensaje de correo electrónico
            const mailOptions = {
                from: "tu-correo@gmail.com",
                to: paymentData.mail,
                subject: "Confirmación de subscripción",
                attachments: [{
                    filename: "factura.pdf",
                    content: pdfData
                }]
            };

            // Enviar el correo electrónico
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Correo electrónico enviado: " + info.response);
                }
            });
        }
    });
}

module.exports = router;