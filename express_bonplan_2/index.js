const express = require("express");
const exphbs = require("express-handlebars");
const expressSession = require("express-session");
const { session } = require("passport");
const MongoStore = require("connect-mongo")(expressSession);
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User");
const Product = require("./models/Product");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator")
const multer = require('multer');
//const upload = multer({ dest: 'public/uploads/' });
var fs = require('fs');

// .env déploiement
require('dotenv').config();
const { PORT, MONGODB_URI, API_KEY } = process.env;


const port = process.env.PORT || 3000;

const validationResult = expressValidator.validationResult;
const body = expressValidator.body;

const app = express();

mongoose.connect(
    "mongodb://localhost:27017/bonPlanMarc",
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }
);



let usersRoutes = require('./controllers/users');
app.use('/users', usersRoutes);

let productsRoutes = require('./controllers/products');
app.use('/products', productsRoutes);

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
        let ext = file.originalname.substring(
            file.originalname.lastIndexOf("."),
            file.originalname.length
        );
        cb(null, Date.now() + ext);
    },
});

let upload = multer({ storage: storage });



app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}));
app.set("view engine", "handlebars");


app.use(
    expressSession({
        secret: "konexioasso07",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    })
);



// l'ordre est important, ces 2 app.use doivent etre après l'app.use expressSession ci-dessus
// enable Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
/* passport.use(new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
}, User.authenticate())); */



passport.serializeUser((user, done) => {
    return done(null, user._id)
}); // Save the user.id to the session
passport.deserializeUser(async (_id, done) => {
    const user = await User.findById(_id).lean().exec();
    return done(null, user)
}); // Receive the user.id from the session and fetch the User from the DB by its ID


passport.use(
    new LocalStrategy(
        {
            usernameField: "username",
            passwordField: "password",
        },
        async (username, password, done) => {
            console.log("username", username);
            console.log("password", password);
            console.log("done", done);
            try {
                const user = await User.findOne({ username })
                if (!user) return done(null, false);
                if (user.password == password)
                    return done(null, user)

            } catch (err) {
                console.error(err);
                done(err)
            }
        }
    )
);




app.get('/', (req, res) => {
    console.log("username dans home", req.user)
    console.log("isauthenticated", req.isAuthenticated());
    //console.log("profilpic home", req.user.profilePicture)
    //console.log("req.user.profilePicture", req.user.profilePicture)

    res.render('home', {
        isUserLogged: req.isAuthenticated(),
        username: req.user ? req.user.username : null,
        profilePicture: req.user ? req.user.profilePicture : null
    });
})


app.post('/upload', upload.single('image'), (req, res) => {
    console.log("req.file", req.file);
});



app.get("/profile", (req, res) => {

    if (req.isAuthenticated()) {
        console.log(req.user);
        res.render("profile", {
            username: req.user.username,
            surname: req.user.surname,
            firstName: req.user.firstName,
            isUserLogged: req.isAuthenticated(),
            profilePicture: req.user.profilePicture

        }); console.log("firstName dans profile", req.user.firstName)
    } else {
        res.redirect("/");
    }
});


app.get("/signup", async (req, res) => {

    if (req.isAuthenticated()) {
        res.redirect("/profile");
    } else {
        res.render("signup");
    }
});

//enregistre les valeurs qu'on rentre dans les inputs du signup:

app.post("/signup", upload.single("image"), async (req, res, next) => {
    const { username, password, firstName, surname } = req.body;
    console.log("req.body signup", req.body)
    User.create({
        username,
        password,
        firstName,
        surname,
        profilePicture: req.file.filename
    }, (err, user) => {
        if (err) {
            return res.status(500).send(err)
        }
        next()
    })
}, passport.authenticate("local"), (req, res) => res.redirect("/profile"))




app.get("/login", (req, res) => {
    // console.log('req.isAuthenticated',req.isAuthenticated);

    if (req.isAuthenticated()) {
        res.redirect("/profile");
    } else {
        res.render("login");
    }
});




app.post(
    "/login",
    // console.log('APPPOST', passport.authenticate),
    passport.authenticate("local", {
        successRedirect: "/profile",
        failureRedirect: "/login",
    }), (req, res) => {
        console.log('un message');
    }
);




app.get('/admin', (req, res, next) => {

    if (req.isAuthenticated()) {
        res.render("admin", {
            isUserLogged: req.isAuthenticated(),
            username: req.user ? req.user.username : null,
            profilePicture: req.user ? req.user.profilePicture : null
        });
    } else {
        res.redirect("/");
    }
})


app.post("/admin", upload.single("productPicture"), async (req, res, next) => {
    console.log('req.body', req.body);
    const { productName, productPrice, tagProduct } = req.body;
    try {
        await Product.create(
            new Product({
                productName,
                productPrice,
                productPicture: req.file.filename,
                tagProduct,
            }));

        res.redirect("/products");
    } catch (error) {
        console.log('error', error);
        res.status(500).json(error)
    }
});



app.get("/products", (req, res) => {
    const { productName, tagProduct, productPrice, } = req.body;
    console.log("GET /products");
    if (req.isAuthenticated()) {
        console.log(req.user);
        res.render("products", {
            isUserLogged: req.isAuthenticated(),
            username: req.user ? req.user.username : null,
            profilePicture: req.user.profilePicture,
            productName,
            productPrice,
            tagProduct,
            productPicture: req.file.filename,

        });
    } else {
        res.redirect("/");
    }
});



app.post('/products', (req, res) => {
    console.log('req du body', req.body)
    const { productName, tagProduct, productPrice, } = req.body;
    res.render('products', {
        productName,
        productPrice,
        productPicture: req.file.filename,
        tagProduct,
    })
});





app.get("/logout", (req, res) => {
    // console.log("GET /logout", req);
    req.logout();
    res.redirect("/");


});




app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});
