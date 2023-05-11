const express = require("express");
const bcrypt = require("bcrypt");
const validations = require("../shared/validations.js");

const Docker = require("dockerode");
const docker = new Docker();

let User = require("../models/user.js");
let router = express.Router();

router.get("/me", validations.validateToken, async (req, res) => {
    User.findById(req.user.id).then((result) => {
        if (result) {
            res.status(200).send({ ok: true, result: result });
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

// router.get("/images/:imageName", (req, res) => {
//     const imageName = req.params.imageName;
//     docker.pull(imageName, (err, stream) => {
//         if (err) {
//             console.log(err);
//             return res.status(500).send("Error pulling image");
//         }
//         // eslint-disable-next-line no-undef
//         res.send("Imagen encontrada",stream.pipe(process.stdout));
//     });
// });

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
                $set: {
                    favorites: req.body.favorites
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
        req.user.id,
        {
            $set: {
                avatar: req.body.avatar
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
});

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
