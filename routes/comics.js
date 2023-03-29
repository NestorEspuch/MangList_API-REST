const express = require("express");
const router = express.Router();
const Comic = require("../models/comic.js");
const apiAxios = require("../API/Axios.Services.js");

// let API = require("../API/API.Service.js");


router.get("/", (req, res) => {

    // API.getAllMangas(2, (data) => {
    //     res.status(200).send({ ok: true, result: data });
    //     console.error(data);
    // });


    Comic.find()
        .then((result) => {
            if (result.length > 0) {
                apiAxios.getDataWithBearerToken().then((data) => {
                    res.status(200).send({ ok: true, result: Object.assign(data.data, result) });
                }).catch((e) => {
                    res.status(400).send({
                        ok: false,
                        error: "Error al registrar el comic: " + e,
                    });
                });
            } else {
                res.status(500).send({
                    ok: false,
                    error: "Error al buscar los comics, no se encontraron resultados.",
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

router.get("/:id", (req, res) => {
    Comic.findById(req.params["id"])
        .then((result) => {
            if (result) {
                res.status(200).send({ ok: true, result: result });
            } else {
                res.status(500).send({
                    ok: false,
                    error: "Error al buscar el comic.",
                });
            }
        })
        .catch(() => {
            apiAxios.getComicId(req.params["id"]).then((data) => {
                res.status(200).send({ ok: true, result: data });
            }).catch((e) => {
                res.status(500).send({
                    ok: false,
                    error: "Error al buscar el comic: " + e,
                });
            });
        });
});

router.post("/add", (req, res) => {
    let newComic = new Comic(req.body);
    if (newComic) {
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
    } else {
        res.status(500).send({
            ok: false,
            error: "Datos recibidos incorrectos.",
        });
    }
});

module.exports = router;
