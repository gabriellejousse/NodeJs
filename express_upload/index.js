const express = require('express');
const exphbrs = require('express-handlebars');
const mongoose = require('mongoose');
const multer = require('multer');
//const upload = multer({ dest: 'public/uploads/' });
const app = express();
const port = 3001;

//let userArray=[];
//let imgArray=[];



app.engine('handlebars', exphbrs());

app.set('view engine', 'handlebars')



/* Mongoose :  */

mongoose.connect('mongodb://localhost:27017/upload', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err => console.log(err))

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function(req, file, cb) {
        console.log('file multer diskstorage', file);
        cb(null, file.originalname)
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, Date.now() + ext)
    }
})

var upload = multer({ storage: storage})

const User = new mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    firstname: String,
    surname: String,
    profilePicture: String
})


const UserSchema = mongoose.model('User', User)



app.get('/', (req, res) => {
    res.render('home', {
        title: 'Welcome to express upload'
    })
})


// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// parse application/json
app.use(express.json());



app.post('/upload', upload.single('image'), async (req, res, next) => {
    let usernamevar = req.body.username
    //let imageUp = req.file //changé avec leandro

    console.log("username:", usernamevar)
    //console.log(userArray)
    //console.log('id image : ', imageUp)

    const user_1 = await new UserSchema ({
        username: usernamevar,
        profilePicture: req.file.filename //changé avec leandro
    })
    user_1.save().then(res => console.log(res))

    console.log("user_1 :", user_1)

    res.render("add1user", {
        username: usernamevar,
        id: user_1._id
        // image: imageUp.originalname
    })

})

/* app.get('/users/:id', (req, res, next) => {
    res.send(
        ${req.params.id}
    )
}) */



// app.get('/users/:id', async (req, res, next) => {
//      let idUser = "5fae7b7ec1e6fe8549f7574c"
//     //let idUser = req.params.id
//     /*     const result = UserSchema.findById(`${idUser}`, function (err, res) {
//             console.log(res.toObject())
//         }) */
//     const user = await UserSchema.findById(idUser)
//     console.log("user:", user)
//     console.log("username:", user.username)
//     console.log("image:", user.profilePicture)

//     /*     res.render("userpage", {
//             user: idUser.username,
//             image: idUser.profilePicture
//         }
//     ) */
//     res.render("userpage", {
//         user: user.username,
//         image: user.profilePicture
//     } )
// })



app.get('/users/:id/', (req, res) => {

    //let iduser = "5faeacca36c9b48d025e69b7"
    let iduser = req.params.id

    let result = UserSchema.findById(iduser, function (err, result) {
        console.log('result - findById', result)

        res.render('userpage', {
            username: result.username,
            profilePicture: result.profilePicture
        })
    })
});


/* app.post('/users/:id', upload.single('image'), (req, res, next) => {
    let idUser = req.params.id
    res.render("userpage", {
        user: result.username,
        image: result.profilePicture
    })

}) */


//pour accéder à l'image depuis le localhost : taper dans le nav localhost:3001/img/image.png :
app.use(express.static('public/'));


app.listen(port, () => {
    console.log('server started on port 3001')
})