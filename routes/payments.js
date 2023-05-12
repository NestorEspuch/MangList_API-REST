const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const express = require("express");
const { Buffer } = require("buffer");

const Payment = require("../models/payment.js");

let router = express.Router();

router.get("/", async (req, res) => {
    let paymentData = new Payment({
        idUser: req.body.idUser,
        date: req.body.date,
        amount: req.body.amount,
        name: req.body.name,
        mail: req.body.mail,
        methodPayment: req.body.methodPayment
    });
    generateAndSendInvoice(paymentData).then(()=>{
        res.status(400).send({ok:true,result:`Correo electrónico enviado a ${paymentData.mail}: ${paymentData.messageId}`});
    }).catch();

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