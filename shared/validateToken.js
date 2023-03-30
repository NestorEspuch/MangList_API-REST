const jwt = require("jsonwebtoken");
const globalToken = require("./const.js");

const validateToken = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) return res.status(401).json({ error: "Acceso denegado" });
    try {
        const verified = jwt.verify(token, globalToken.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: "token no es válido" });
    }
};

module.exports = validateToken;