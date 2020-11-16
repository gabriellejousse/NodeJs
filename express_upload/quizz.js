const e = require('express');
const express = require('express');
const app = express();
const PORT = 3001;
const mongoose = require('mongoose');


// Utilisation du middleware global body parser pour pouvoir lire les donnée JSON envoyé dans le body
app.use(express.json());


// Connection a notre database mongodb =======================================
const dbusers = mongoose.connect('mongodb://localhost:27017/users', { useNewUrlParser: true, useUnifiedTopology: true })


// Création de notre modele de donnée mongoose ===============================


const user = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    age: { 
        Number,
        min: 0
        }
})


// 2- reliez le schéma au modèle. Stockez ce modèle dans une variable User.

const User = mongoose.Model('User', user)


// Déclaration des routes du serveurs =======================================
// 3- Créez une route permettant de récupérer toute la liste des users stocké dans la db



app.get('/allusers', (req, res) => {
    User.find({}, (err, dbusers) => {
        const users = dbusers.map((user) => user.toObject());
        res.render('profile', {
            users
        });
    });
});


// Démarrage du serveur expressJS
app.listen(PORT, () => {
    console.log(`Server listening on: ${PORT}`)
});
Réduire



