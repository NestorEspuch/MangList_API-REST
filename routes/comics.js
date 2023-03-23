const express = require("express");

let Comic = require("../models/comic.js");
let router = express.Router();

router.post("/add", (req, res) => {
    Comic.find().then((comics) => {
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
            Comic.save().then((result) => {
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
    }).catch((e) => {
        res.status(400).send({
            ok: false,
            error: "Error al registrar el comic: " + e,
        });
    });
});

module.exports = router;
