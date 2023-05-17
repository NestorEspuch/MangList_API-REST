const jwt = require("jsonwebtoken");
const globalToken = require("./const.js");
const User = require("../models/user.js");

const validateToken = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) return res.status(401).json({ error: "Acceso denegado no tienes un token: "+token });
    try {
        const verified = jwt.verify(token, globalToken.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: "token no es válido" });
    }
};

const validateRole = async (req, res, next) => {
    const id = req.header("user-id");
    let role = "";
    if (!id) return res.status(401).json({ error: "Acceso denegado" });
    try {
        console.log(id);
        User.findById(id).then((result) => {
            if (result) {
                role = result.role;
                if (role != "admin" && role != "subscribed") return res.status(401).json({ error: "Acceso denegado no tienes el rol necesario: "+role });
                next();
            } else {
                res.status(500).send({
                    ok: false,
                    error: "Error al buscar el usuario.",
                });
            }
        }).catch(() => {
            res.status(400).send({
                ok: false,
                error: "Usuario no existe.",
            });
        });
    } catch (error) {
        res.status(400).json({ error: "El rol de usuario no es válido" });
    }
};

const validateAdmin = async (req, res, next) => {
    const id = req.header("user-id");
    let role = "";
    if (!id) return res.status(401).json({ error: "Acceso denegado" });
    try {
        console.log(id);
        User.findById(id).then((result) => {
            if (result) {
                role = result.role;
                if (role != "admin") return res.status(401).json({ error: "Acceso denegado" });
                next();
            } else {
                res.status(500).send({
                    ok: false,
                    error: "Error al buscar el usuario.",
                });
            }
        }).catch(() => {
            res.status(400).send({
                ok: false,
                error: "Usuario no existe.",
            });
        });
    } catch (error) {
        res.status(400).json({ error: "El rol de usuario no es válido" });
    }
};

module.exports = { validateToken, validateRole, validateAdmin };