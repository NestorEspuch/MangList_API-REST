// Carga de librerías
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cors = require("cors");
// Enrutadores
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const comicRouter = require("./routes/comics");
const mailRouter = require("./routes/mail");

// Conectar con BD en Mongo
//? MONGO EN MONGODB: mongodb+srv://andresuqui2:andresuqui2@manglist.aih5yik.mongodb.net/test
//? MONGO CONTENEDOR: mongodb://mymongodb/MangList_API
mongoose.connect("mongodb+srv://andresuqui2:andresuqui2@manglist.aih5yik.mongodb.net/test", {
    useNewUrlParser: true,
});

// Inicializar Express
let app = express();

app.use(express.json({limit:'10mb'}));

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"]
}));
// Cargar middleware body-parser para peticiones POST y PUT
// y enrutadores
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Middleware para procesar otras peticiones que no sean GET o POST
app.use(
    methodOverride(function (req) {
        if (req.body && typeof req.body === "object" && "_method" in req.body) {
            let method = req.body._method;
            delete req.body._method;
            return method;
        }
    })
);

app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/comics", comicRouter);
app.use("/mail", mailRouter);

// Puesta en marcha del servidor
app.listen(3000);
