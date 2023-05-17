const express = require("express");
const Comic = require("../models/comic.js");
const apiAxios = require("../API_MyAnimeList/Axios.Service.js");
const validations = require("../shared/validations.js");
const router = express.Router();

router.get("/", async (req, res) => {
    if (req.query["search"]) {
        apiAxios.getAllMangasByString(req.query.search)
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
            .catch((e) => {
                res.status(500).send({
                    ok: false,
                    error: "Error al buscar el comic." + e,
                });

            });
    } if (req.query["categorias"]) {
        apiAxios.getAllCategories()
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
            .catch((e) => {
                res.status(500).send({
                    ok: false,
                    error: "Error al buscar el comic." + e,
                });

            });
    }
    else {
        Comic.find()
            .then((result) => {
                if (result.length > 0) {
                    apiAxios.getAllMangas().then((data) => {
                        // const resultFinally = {node:result,ranking:{rank:2}};
                        // const sentResult = {...data.data,...resultFinally};
                        res.status(200).send({ ok: true, result: data.data});
                    }).catch((e) => {
                        res.status(400).send({
                            ok: false,
                            error: "Error al buscar los comics: " + e,
                        });
                    });
                } else {
                    apiAxios.getAllMangas().then((data) => {
                        res.status(200).send({ ok: true, result: Object.assign(data.data) });
                    }).catch((e) => {
                        res.status(400).send({
                            ok: false,
                            error: "Error al buscar los comics: " + e,
                        });
                    });
                }
            })
            .catch(() => {
                apiAxios.getAllMangas().then((data) => {
                    res.status(200).send({ ok: true, result: data.data });
                }).catch((e) => {
                    res.status(400).send({
                        ok: false,
                        error: "Error al buscar los comics: " + e,
                    });
                });
            });
    }
});

router.get("/:id", async (req, res) => {
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

router.post("/add", validations.validateToken, validations.validateRole, async (req, res) => {
    let newComic = new Comic(req.body);
    if (newComic) {
        Comic.find()
            .then((comics) => {
                let existComic = comics.filter(
                    (comic) =>
                        comic.title == req.body.title
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
                    }).catch((e)=>{
                        res.status(500).send({
                            ok: false,
                            error: "Error al registrar el comic."+e,
                        });
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

router.delete("/:id", validations.validateToken, validations.validateRole, async (req, res) => {
    Comic.findByIdAndRemove(req.params.id).then(resultado => {
        res.status(200).send({ ok: true, result: resultado });
    }).catch(() => {
        res.status("error", { error: "Error borrando libro" });
    });
});

module.exports = router;
