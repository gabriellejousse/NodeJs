const express = require('express');
const exphbrs = require('express-handlebars');
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({ dest: 'public/' });
const app = express();
const port = 3001;

let userArray=[];
let imgArray=[];

app.engine('handlebars', exphbrs());

app.set('view engine', 'handlebars')

/* Mongoose :  */

mongoose.connect('mongodb://localhost:27017/upload', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err => console.log(err))

const User = new mongoose.Schema({
    username: {
        type: [String],
        index: true
    },
    firstname: String,
    surname: String,
    profilePicture: String
})

const userSchema = mongoose.model('User', User)

/* const user1= new userSchema({
    username: 'gabjou',
    firstname: 'gabrielle',
    surname: 'jousse',
    profilePicture: './public/img/emoji-1.jpg'
})
user1.save().then(res => console.log(res))

const user2= new userSchema({
    username: 'yac93',
    firstname: 'yacine',
    surname: 'ames',
    profilePicture: './public/img/emoji-2.jpg'
})
user2.save().then(res => console.log(res))

const user3= new userSchema({
    username: 'veganchampi',
    firstname: 'marc',
    surname: 'sirisak',
    profilePicture: './public/img/emoji-3.jpg'
})
user3.save().then(res => console.log(res)) */



app.get('/', (req, res) => {
    res.render('home', {
        title: 'Welcome to express upload'
    })
})

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// parse application/json
app.use(express.json());




app.post('/upload', upload.single('image'), (req, res, next) => {
    let usernamevar = req.body.username
    //let imageUp = req.file.image
    //on met les username entrés dans le input dans l'array vide userArray
    userArray.push(usernamevar)
    //imgArray.push(imageUp)
    
    console.log("username:", usernamevar)
    console.log(userArray)

    res.render("add1user", {
        username: usernamevar,
        //image: imageUp
    })
})






//pour accéder à l'image depuis le localhost : taper dans le nav localhost:3001/img/image.png :
app.use(express.static('public/'));


app.listen(port, () => {
    console.log('server started on port 3001')
})