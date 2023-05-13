const nodemailer = require("nodemailer");
const express = require("express");

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
        generatePDFAndSendEmail(paymentData, res).then((e) => {
            res.status(200).send("Correo electrónico enviado: " + e.response);
        }).catch((e) => {
            res.status(400).send("Correo electrónico no enviado: " + e);
        });
    }).catch((e) => {
        res.status(500).send({ ok: false, result: "Usuario no encontrado: " + e });
    });

});

async function generatePDFAndSendEmail(paymentSchema, res) {
    const pdfMake = require("../pdfmaker/pdfmake");
    const vfsFonts = require("../pdfmaker/vfs_fonts.js");

    const { date, amount, name, mail, methodPayment } = paymentSchema;

    pdfMake.vfs = vfsFonts.pdfMake;
    // Definir el contenido del documento PDF
    const documentDefinition = {
        content: [
            { text: "FACTURA", style: "header" },
            { text: `Fecha: ${date}` },
            { text: `Nombre: ${name}` },
            { text: `Correo electrónico: ${mail}` },
            { text: `Método de pago: ${methodPayment}` },
            { text: `Monto: ${amount} USD` }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10]
            }
        }
    };

    // Generar el documento PDF
    const pdfDoc = pdfMake.createPdf(documentDefinition);

    // Enviar el documento PDF por correo electrónico utilizando nodemailer
    pdfDoc.getBuffer(async (buffer) => {
        // Configurar el transporte SMTP para enviar correos electrónicos
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            post: 587,
            auth: {
                user: "info.manglist@gmail.com",
                pass: "zsdxowdmmpkvgnlc"
            }
        });

        // Definir los detalles del correo electrónico
        const mailOptions = {
            from: "MangList", // aquí debes reemplazar con tu correo electrónico
            to: mail,
            subject: "Factura de suscripción",
            text: "Se adjunta la factura de su suscripción",
            attachments: [
                {
                    filename: "factura.pdf",
                    content: buffer
                }
            ]
        };

        // Enviar el correo electrónico
        await transporter.sendMail(mailOptions,(error) => {
            console.log(error);
    
            if (error) return res.status(500).send({
                ok: false,
                error: "Error al enviar el correo: " + error,
            });
        });
    });
}

module.exports = router;