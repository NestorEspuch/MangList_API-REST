const jwt = require("jsonwebtoken");
const globalToken = require("./const.js");

const validateToken = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) return res.status(401).json({ error: "Acceso denegado" });
    try {
        const verified = jwt.verify(token, globalToken.TOKEN_SECRET);
        console.log(verified);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: "token no es válido" });
    }
};

const validateRole = async (req, res, next) => {
    const role = req.header("user-role");
    if (!role) return res.status(401).json({ error: "Acceso denegado" });
    try {
        if (role != "admin" && role != "subscribed") return res.status(401).json({ error: "Acceso denegado" });
        next();
    } catch (error) {
        res.status(400).json({ error: "El rol de usuario no es válido" });
    }
};

module.exports = { validateToken, validateRole };