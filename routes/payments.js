const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const express = require("express");
const { Buffer } = require("buffer");

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
    const doc = new PDFDocument();
    const filename = `factura_${paymentData.date}.pdf`;

    // Agregar el contenido al documento PDF
    doc.fontSize(18).text("Factura", { align: "center" });
    doc.fontSize(12).text(`Fecha: ${paymentData.date}`);
    doc.fontSize(12).text(`Nombre: ${paymentData.name}`);
    doc.fontSize(12).text(`Monto: ${paymentData.amount}`);

    // Guardar el documento PDF en un buffer
    const buffer = await new Promise(resolve => {
        const chunks = [];
        doc.on("data", chunk => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.end();
    });

    // Configurar el servicio de correo electrónico
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        post: 587,
        auth: {
            user: "info.manglist@gmail.com",
            pass: "zsdxowdmmpkvgnlc"
        }
    });

    // Configurar el correo electrónico a enviar
    const mailOptions = {
        from: "info.manglist@gmail.com",
        to: paymentData.mail,
        subject: "Confirmación de subscripción",
        attachments: [{
            filename: filename,
            content: buffer
        }]
    };


    // Enviar el correo electrónico
    const info = await transporter.sendMail(mailOptions);
    console.log(`Correo electrónico enviado a ${paymentData.mail}: ${info.messageId}`);
}
module.exports = router;