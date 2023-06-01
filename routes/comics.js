const express = require("express");
const Comic = require("../models/comic.js");
// const apiAxios = require("../API_MyAnimeList/Axios.Service.js");
const validations = require("../shared/validations.js");
const fs = require("fs");
const comicsJson = require("../assets/backup/comics.json");
const router = express.Router();


function readFile(res) {
    fs.readFile(comicsJson, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send({ ok: false, error: "Error al leer el archivo json de los comics" });
        }

        const comics = JSON.parse(data);
        return comics.data;
    });
}

router.get("/", async (req, res) => {
    let comicsread = readFile(res);
    fs.readFile("../assets/backup/comics.json", "utf8", (err, data) => {
        if (err) {
            return res.status(500).send({ ok: false, error: "Error al leer el archivo json de los comics" });
        }
        const comics = JSON.parse(data);
        if (comics) {
            res.status(200).send({ ok: true, result: JSON.parse(data), c: comicsread,c2:comics,c3:"COMISC CON CADENA" });
        }
    });
    fs.readFile(comicsJson, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send({ ok: false, error: "Error al leer el archivo json de los comics" });
        }
        const comics = JSON.parse(data);
        if (comics) {
            res.status(200).send({ ok: true, result: JSON.parse(data), c: "COMICS SIN CADENA ENTERA",c2:comicsread, c3:comics });
        }
    });
    // if (req.query["search"]) {
    //     let result = readFile(res).filter(comic => {
    //         comic.node.title.toLowerCase().includes(req.query.search.toLowerCase());
    //     });
    //     res.status(200).send({ ok: true, result: result });
    //     apiAxios.getAllMangasByString(req.query.search)
    //         .then((result) => {
    //             if (result) {
    //                 res.status(200).send({ ok: true, result: result });
    //             } else {
    //                 res.status(500).send({
    //                     ok: false,
    //                     error: "Error al buscar el comic.",
    //                 });
    //             }
    //         })
    //         .catch(() => {
    //             let result = readFile(res).filter(comic => {
    //                 comic.node.title.toLowerCase().includes(req.query.search.toLowerCase());
    //             });
    //             res.status(200).send({ ok: true, result: result });
    //         });
    // } if (req.query["categorias"]) {
    //     apiAxios.getAllCategories()
    //         .then((result) => {
    //             if (result) {
    //                 res.status(200).send({ ok: true, result: result });
    //             } else {
    //                 res.status(500).send({
    //                     ok: false,
    //                     error: "Error al buscar los comics.",
    //                 });
    //             }
    //         })
    //         .catch(() => {
    //             let result = readFile(res);
    //             res.status(200).send({ ok: true, result: result });
    //         });
    // }
    // else {
    //     Comic.find()
    //         .then((result) => {
    //             if (result.length > 0) {
    //                 apiAxios.getAllMangas().then((data) => {
    //                     result.forEach((e) => {
    //                         data.data.push({ node: e, ranking: { rank: 2 } });
    //                     });
    //                     res.status(200).send({ ok: true, result: data.data });
    //                 }).catch(() => {
    //                     readFile(res);
    //                 });
    //             } else {
    //                 apiAxios.getAllMangas().then((data) => {
    //                     res.status(200).send({ ok: true, result: Object.assign(data.data) });
    //                 }).catch(() => {
    //                     let result = readFile(res);
    //                     res.status(200).send({ ok: true, result: result });
    //                 });
    //             }
    //         })
    //         .catch(() => {
    //             apiAxios.getAllMangas().then((data) => {
    //                 res.status(200).send({ ok: true, result: data.data });
    //             }).catch(() => {
    //                 let result = readFile(res);
    //                 res.status(200).send({ ok: true, result: result });
    //             });
    //         });
    // }
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
            let result = readFile(res).filter(comic => {
                comic.node.id == req.params["id"];
            });
            res.status(200).send({ ok: true, result: result });
            // apiAxios.getComicId(req.params["id"]).then((data) => {
            //     res.status(200).send({ ok: true, result: data });
            // }).catch(() => {
            //     let result = readFile(res).filter(comic => {
            //         comic.node.id == req.params["id"];
            //     });
            //     res.status(200).send({ ok: true, result: result });

            // });
        });
});

router.post("/add", validations.validateToken, validations.validateRole, validations.validateAdmin, async (req, res) => {
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
                    }).catch((e) => {
                        res.status(500).send({
                            ok: false,
                            error: "Error al registrar el comic." + e,
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

router.put("/:id", validations.validateToken, validations.validateRole, async (req, res) => {
    let newComic = new Comic(req.body);
    if (newComic) {
        Comic.findByIdAndUpdate(req.params["id"], {
            $set: {
                genres: newComic.genres, main_picture: newComic.main_picture, mean: newComic.mean,
                num_volumes: newComic.num_volumes, start_date: newComic.start_date, status: newComic.status, synopsis: newComic.synopsis, title: newComic.title
            }
        }, { new: true, runValidators: true, }).then((result) => {
            res.status(200).send({ ok: true, result: result });
        }).catch((error) => {
            res.status(400).send({
                ok: false,
                error: "Error modificando el comic: " + error,
            });
        });
    } else {
        res.status(500).send({
            ok: false,
            error: "Datos recibidos incorrectos.",
        });
    }

});

router.delete("/:id", validations.validateAdmin, async (req, res) => {
    Comic.findByIdAndRemove(req.params.id).then(resultado => {
        res.status(200).send({ ok: true, result: resultado });
    }).catch(() => {
        res.status("error", { error: "Error borrando libro" });
    });
});

module.exports = router;
