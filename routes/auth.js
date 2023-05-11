const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user.js");
const router = express.Router();
const globalToken = require("../shared/const.js");
const multer = require("multer");

const { Buffer } = require("buffer");
const path = require("path");
const fs = require("fs");

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "img/users");
    },
    filename: function (req, file, cb) {
        cb(null, "andresuqui2" + "_" + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // Establece el límite de tamaño de archivo a 10MB
});


router.post("/register", upload.single("avatar"), async (req, res) => {

    const avatarBuffer = Buffer.from(req.body.avatar, "base64");
    const avatarName = `${req.body.name}-${Date.now()}.jpg`;
    // eslint-disable-next-line no-undef
    const avatarPath = path.join(__dirname, "img", "users", avatarName);

    fs.writeFile(avatarPath, avatarBuffer, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error al guardar el avatar del usuario.");
        } else {
            // Aquí guardas los datos del usuario en tu base de datos o archivo.
            res.status(200).send(`Usuario registrado con éxito. |||||| Usuario ${req.body.name} registrado con éxito.`);
        }
    });

    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        //! Cambiar cuando se solucione la subida de imagenes
        avatar: req.file.path,
        role: req.body.role
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
                .catch(() => {
                    res.status(400).send({
                        ok: false,
                        error: "Error al registrar el usuario: " + newUser.avatar,
                    });
                });
        }
    }).catch(() => {
        res.status(400).send({
            ok: false,
            error: newUser,
        });
    });
});

router.post("/login", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.find()
        .then((users) => {
            let existUser = users.filter(
                (user) =>
                    user.email == email &&
                    bcrypt.compareSync(password, user.password)
            );

            if (existUser.length > 0) {
                const token = jwt.sign({
                    password: password,
                    email: email
                }, globalToken.TOKEN_SECRET);

                res.set({
                    "auth-token": token,
                    "user-id": existUser[0].id
                }).json({
                    error: null,
                    data: { token: token, id: existUser[0].id }
                });

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
