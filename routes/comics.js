const express = require("express");

let Comic = require("../models/comic.js");
let router = express.Router();

router.get("/", (res) => {
    Comic.find()
        .then((result) => {
            if (result) {
                res.status(200).send({ ok: true, result: result });
            } else {
                res.status(500).send({
                    ok: false,
                    error: "Error al buscar los comics.",
                });
            }
        })
        .catch(() => {
            res.status(400).send({
                ok: false,
                error: "Error al buscar los comics.",
            });
        });
});

router.post("/add", (req, res) => {
    let newComic = new Comic(req.body);
    if (newComic.length > 0) {
        Comic.find()
            .then((comics) => {
                let existComic = comics.filter(
                    (comic) =>
                        comic.title == req.body.title ||
                        comic.media_type == req.body.media_type
                );

                if (existComic.length > 0) {
                    res.status(400).send({
                        ok: false,
                        error: "El comic ya existe.",
                    });
                } else {
                    newComic.save(req.body).then((result) => {
                        if (result) {
                            res.status(200).send({ ok: true, result: result });
                        } else {
                            res.status(500).send({
                                ok: false,
                                error: "Error al registrar el comic.",
                            });
                        }
                    });
                }
            })
            .catch((e) => {
                res.status(400).send({
                    ok: false,
                    error: "Error al registrar el comic: " + e,
                });
            });
    }else{
        res.status(500).send({
            ok: false,
            error: "Datos recibidos incorrectos.",
        });
    }
});

module.exports = router;
