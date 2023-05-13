const puppeteer = require("puppeteer");
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
        res.status(200).send({paymen:paymentData,user:user});
        generatePDFAndSendEmail(paymentData,res);
    }).catch((e) => {
        res.status(500).send({ ok: false, result: "Usuario no encontrado: " + e });
    });

});

async function generatePDFAndSendEmail(paymentSchema,res) {
    const { idUser, date, amount, name, mail, methodPayment } = paymentSchema;

    // Generar el contenido HTML de la factura
    const html = `
      <h1>Factura</h1>
      <p>Usuario: ${idUser}</p>
      <p>Fecha: ${date}</p>
      <p>Importe: ${amount}</p>
      <p>Nombre: ${name}</p>
      <p>Correo electrónico: ${mail}</p>
      <p>Método de pago: ${methodPayment}</p>
    `;

    // Configurar el navegador Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generar el PDF a partir del contenido HTML
    const pdf = await page.pdf({ format: "A4" });

    // Cerrar el navegador Puppeteer
    await browser.close();

    // Escribir el archivo PDF generado
    fs.writeFileSync("factura.pdf", pdf);

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
        from: "MangList",
        to: mail,
        subject: "Confirmación de subscripción",
        attachments: [
            {
                filename: "factura.pdf",
                content: pdf,
            },
        ],
    };

    // Enviar el correo electrónico
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send("Correo electrónico enviado: " + info.response);
        }
    });
}

module.exports = router;