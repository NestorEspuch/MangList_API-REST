const express = require("express");
const validations = require("../shared/validations.js");

const Payment = require("../models/payment.js");
const User = require("../models/user.js");
let router = express.Router();

router.get("/", validations.validateAdmin, async (req, res) => {
    Payment.find()
        .then((result) => {
            res.status(200).send({ ok: true, result: result });
        })
        .catch(() => {
            res.status(500).send({
                ok: false,
                error: "Error al buscar los pagos.",
            });
        });
});

router.get("/:id", validations.validateAdmin, async (req, res) => {
    Payment.findById(req.params["id"])
        .then((result) => {
            if (result) {
                res.status(200).send({ ok: true, result: result });
            } else {
                res.status(500).send({
                    ok: false,
                    error: "Error al buscar el pago.",
                });
            }
        })
        .catch(() => {
            res.status(400).send({
                ok: false,
                error: "Pago no encontrado.",
            });
        });
});

router.post("/", validations.validateToken, async (req, res) => {
    const id = req.header("user-id");
    if (req.body) {
        let newPayment = new Payment({
            userId: req.body.userId,
            type: req.body.type,
            method: req.body.method,
            date: req.body.date,
            amount: req.body.amount,
        });

        User.findById(id).then((resultUser) => {
            if (resultUser.role == "admin" || resultUser.role == "subscribed") {
                res.status(401).json({ error: "Ya tienes una subscripción" });
            } else {
                newPayment
                    .save()
                    .then((resultPayment) => {
                        if (resultPayment) {
                            resultUser.role = "subscribed"; // Actualizar el rol del usuario
                            res.status(200).send({ ok: true, result: resultPayment });
                        } else {
                            res.status(500).send({
                                ok: false,
                                error: "Error al registrar el pago.",
                            });
                        }
                    })
                    .catch(() => {
                        res.status(400).send({
                            ok: false,
                            error: "Error al registrar el pago.",
                        });
                    });
            }
        }).catch(() => {
            res.status(400).send({
                ok: false,
                error: "Usuario no existe.",
            });
        });
    } else {
        res.status(500).send({
            ok: false,
            error: "Error al registrar el pago.",
        });
    }
});

module.exports = router;
