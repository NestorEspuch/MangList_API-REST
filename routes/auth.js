const express = require("express");

let User = require("../models/user.js");
let router = express.Router();

router.post("/register", (req, res) => {
    let newUser = new User({
        name: req.body.name,
        password: req.body.password,
        avatar: req.body.avatar,
    });
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
        .catch(() => {
            res.status(400).send({
                ok: false,
                error: "Error al registrar el usuario.",
            });
        });
});

router.post("/login", (req) => {
    let name = req.body.name;
    let password = req.body.password;
    User.find()
        .then((users) => {
            let existUser = users.filter(
                (user) => user.name == name && user.password == password
            );
            if (existUser.length > 0) {
                req.session.user = existUser[0].name;
                req.session.password = existUser[0].password;
            } else {
                console.error("Usuario o contraseña incorrectos");
            }
        })
        .catch((error) => {
            console.error("Error iniciando sesion de usuario" + error);
        });
});

module.exports = router;