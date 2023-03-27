const express = require("express");
const bcrypt = require("bcrypt");

let User = require("../models/user.js");
let router = express.Router();

router.post("/register", (req, res) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        avatar: req.body.avatar,
    });

    User.find().then((users) => {
        let existUser = users.filter(
            (user) => user.name == newUser.name || user.email == newUser.email
        );

        if (existUser.length > 0) {
            res.status(400).send({
                ok: false,
                error: "El usuario ya existe.",
            });
        } else {
            newUser
                .save()
                .then((result) => {
                    if (result) {
                        res.status(200).send({ ok: true, result: result });
                    } else {
                        res.status(500).send({
                            ok: false,
                            error: "Error al registrar el usuario.",
                        });
                    }
                })
                .catch((e) => {
                    res.status(400).send({
                        ok: false,
                        error: "Error al registrar el usuario: " + e,
                    });
                });
        }
    });
});

router.post("/login", (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    User.find()
        .then((users) => {
            let existUser = users.filter(
                (user) =>
                    user.name == name &&
                    user.email == email &&
                    bcrypt.compareSync(password, user.password)
            );

            if (existUser.length > 0) {
                res.status(200).send({ ok: true, result: existUser });
            } else {
                res.status(400).send({
                    ok: false,
                    error: "Usuario o contraseña incorrectos.",
                });
            }
        })
        .catch((error) => {
            res.status(500).send({
                ok: false,
                error: "Error iniciando sesion de usuario: " + error,
            });
        });
});

module.exports = router;
