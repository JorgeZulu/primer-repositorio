const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./public/user');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

const mongo_uri = 'mongodb://127.0.0.1:27017/inicio-sesion';

mongoose.connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once("open", () => {
    console.log("Conexión a la BD exitosa...");
});

connection.on("error", (err) => {
    console.log("Error en la conexión a la BD: ", err);
});

app.post("/register", (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });

    user
        .save()
        .then((status) => {
            res.status(200).send("USUARIO REGISTRADO");
        })
        .catch((err) => {
            res.status(500).send(`ERROR AL REGISTRAR EL USUARIO ${err}`);
        });
});
app.post("/authenticate", (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username })
        .then((docs) => {
            if (!docs) {
                res.status(500).send("EL USUARIO NO EXISTE");
            } else {
                docs.isCorrectPassword(password, (err, result) => {
                    if (err) {
                        res.status(500).send("ERROR AL AUTENTICAR EL USUARIO");
                    } else if (result) {
                        res.status(200).send("USUARIO AUTENTICADO CORRECTAMENTE");
                    } else {
                        res.status(500).send(`USUARIO Y/O CONTRASEÑA INCORRECTA ${result}`);
                    }
                });
            }
        })
        .catch((err) => {
            res.status(500).send(`ERROR AL AUTENTICAR EL USUARIO ${err}`);
        });
});




app.listen(3000, () => {
    console.log('server started');

})
module.exports = app;

