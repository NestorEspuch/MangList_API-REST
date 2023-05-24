const express = require("express");
const bcrypt = require("bcrypt");
const validations = require("../shared/validations.js");
const functions = require("../shared/functions.js");
const nodemailer = require("nodemailer");

let User = require("../models/user.js");
let router = express.Router();





router.get("/me", validations.validateToken, async (req, res) => {
    User.findById(req.user.id).then((result) => {
        if (result) {
            let user = {
                name: result.name,
                email: result.email,
                avatar: result.avatar,
                role: result.role,
                favorites: result.favorites
            };
            res.status(200).send({ ok: true, result: user });
        } else {
            res.status(500).send({
                ok: false,
                error: "Error al buscar el usuario.",
            });
        }
    }).catch((error) => {
        res.status(400).send({
            ok: false,
            error: error
        });
    });
});

router.get("/:id", validations.validateToken, async (req, res) => {
    User.findById(req.params["id"])
        .then((result) => {
            if (result) {
                res.status(200).send({ ok: true, result: result });
            } else {
                res.status(500).send({
                    ok: false,
                    error: "Error al buscar el usuario.",
                });
            }
        })
        .catch(() => {
            res.status(400).send({
                ok: false,
                error: "Usuario no encontrado.",
            });
        });
});

router.put("/favorites/:id", validations.validateToken, async (req, res) => {
    if (req.body) {
        User.findByIdAndUpdate(
            req.params["id"],
            {
                $addToSet: {
                    favorites: req.body.idComic
                },
            },
            {
                new: true,
                runValidators: true,
            }
        )
            .then((result) => {
                res.status(200).send({ ok: true, result: result });
            })
            .catch((error) => {
                res.status(400).send({
                    ok: false,
                    error: error + "Error modificando los favoritos.",
                });
            });
    } else {
        res.status(500).send({
            ok: false,
            error: "Datos recibidos incorrectos.",
        });
    }
});

router.put("/password-recovery", async (req, res) => {
    if (req.body) {
        const newPassword = functions.passGenerator(8);

        User.find().then((result) => {
            const user = result.find((user) => user.email === req.body.email);
            if (user) {
                User.findByIdAndUpdate(user._id, {
                    $set: {
                        password: bcrypt.hashSync(newPassword, 8),
                    },
                }, {
                    new: true,
                    runValidators: true,
                }).then(() => {

                    const transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        post: 587,
                        auth: {
                            user: "info.manglist@gmail.com",
                            pass: "zsdxowdmmpkvgnlc"
                        }
                    });

                    const mailOptions = {
                        from: "MangList", // tu dirección de correo electrónico
                        to: req.body.email, // dirección de correo electrónico del destinatario
                        subject: "Recuperación de contraseña",
                        text: "Tu nueva contraseña es: " + newPassword + " |Recuerda cambiarla nuevamente en tu perfil."
                    };
                    transporter.sendMail(mailOptions, function (error) {
                        if (error) {
                            res.status(400).send({
                                ok: false,
                                error: "Error al enviar el correo (post)" + error,
                            });
                        } else {
                            res.status(200).send({
                                ok: true,
                                result: result,
                            });
                        }
                    });
                }).catch((error) => {
                    res.status(400).send({
                        ok: false,
                        error: error + "Error modificando la contraseña."
                    });
                });
            }

        }).catch((error) => {
            res.status(400).send({
                ok: false,
                error: error + "Error buscando el usuario."
            });
        });
    } else {
        res.status(500).send({
            ok: false,
            error: "Datos recibidos incorrectos.",
        });
    }
});

router.put("/favorites/delete/:id", validations.validateToken, async (req, res) => {
    if (req.body) {
        User.findByIdAndUpdate(
            req.params["id"],
            {
                $pullAll: {
                    favorites: [{ _id: req.body.idComic }],
                },
            },
            {
                new: true,
                runValidators: true,
            }
        )
            .then((result) => {
                res.status(200).send({ ok: true, result: result });
            })
            .catch((error) => {
                res.status(400).send({
                    ok: false,
                    error: error + "Error eliminando el comic favorito.",
                });
            });
    } else {
        res.status(500).send({
            ok: false,
            error: "Datos recibidos incorrectos.",
        });
    }
});

router.put("/user/:id", validations.validateToken, async (req, res) => {
    if (req.body) {
        User.findByIdAndUpdate(req.params["id"], {
            $set: {
                name: req.body.name,
                email: req.body.email,
            },
        }, {
            new: true,
            runValidators: true,
        }).then((result) => {
            res.status(200).send({ ok: true, result: result });
        }).catch((error) => {
            res.status(400).send({
                ok: false,
                error: error + "Error modificando el usuario.",
            });
        });
    } else {
        res.status(500).send({
            ok: false,
            error: "Datos recibidos incorrectos.",
        });
    }
});

router.put("/password/:id", validations.validateToken, async (req, res) => {
    if (req.body && req.body.firstPassword === req.body.secondPassword) {
        User.findByIdAndUpdate(req.params["id"], {
            $set: {
                password: bcrypt.hashSync(req.body.firstPassword, 8),
            },
        }, {
            new: true,
            runValidators: true,
        }).then((result) => {
            res.status(200).send({ ok: true, result: result });
        }).catch((error) => {
            res.status(400).send({
                ok: false,
                error: error + "Error modificando la contraseña.",
            });
        });
    } else {
        res.status(500).send({
            ok: false,
            error: "Datos recibidos incorrectos.",
        });
    }
});

router.put("/avatar/:id", validations.validateToken, async (req, res) => {

    User.findByIdAndUpdate(
        req.params["id"],
        {
            $set: {
                avatar: req.body.avatar,
            },
        },
        {
            new: true,
            runValidators: true,
        }
    )
        .then((result) => {
            res.status(200).send({ ok: true, result: result });
        })
        .catch((error) => {
            res.status(400).send({
                ok: false,
                error: error + "Error modificando el avatar.",
            });
        });
}



);

//! QUITAR EL ROLE PARA QUE NO PUEDA SER ADMIN
router.put("/:id", validations.validateToken, async (req, res) => {
    if (req.body) {
        User.findByIdAndUpdate(
            req.params["id"],
            {
                $set: {
                    name: req.body.name,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, 8),
                    avatar: req.body.avatar,
                    role: req.body.role
                },
            },
            {
                new: true,
                runValidators: true,
            }
        )
            .then((result) => {
                res.status(200).send({ ok: true, result: result });
            })
            .catch((error) => {
                res.status(400).send({
                    ok: false,
                    error: error + "Error modificando el usuario.",
                });
            });
    } else {
        res.status(500).send({
            ok: false,
            error: "Datos recibidos incorrectos.",
        });
    }
});

router.delete("/:id", validations.validateToken, async (req, res) => {
    User.findByIdAndDelete(req.params["id"])
        .then((result) => {
            res.status(200).send({ ok: true, result: result });
        })
        .catch(() => {
            res.status(400).send({
                ok: false,
                error: "Error eliminando el usuario",
            });
        });
});

module.exports = router;
