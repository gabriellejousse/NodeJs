const express = require("express");
const exphbs = require("express-handlebars");
const expressSession = require("express-session");
const { session } = require("passport");
const MongoStore = require("connect-mongo")(expressSession);
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User")
const bodyParser = require("body-parser");
const expressValidator = require("express-validator")
const multer = require('multer');
//const upload = multer({ dest: 'public/uploads/' });

const port = 3002;
var fs = require('fs');


const validationResult = expressValidator.validationResult;
const body = expressValidator.body;

const app = express();

let usersRoutes = require('./controllers/users');
app.use('/users', usersRoutes);

let productsRoutes = require('./controllers/products');
app.use('/products', productsRoutes);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        console.log('file multer diskstorage', file);
        cb(null, file.originalname)
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, Date.now() + ext)
    }
})

//var upload = multer({ storage: storage})

app.use(express.static('public'));

app.get('/admin', (req, res, next) => {
    res.render('admin')
})

mongoose.connect(
    "mongodb://localhost:27017/bonPlan",
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }
);


// Express configuration
app.engine("handlebars", exphbs({
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}));

// exphbs.registerPartial('navbarLogged', fs.readFileSync(__dirname + '/views/partials/navbarLogged', 'utf8'));
// exphbs.registerPartials(__dirname + '/views/partials');

app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// enable session management
// paramétrer la session / cookie, 

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


        res.render('home', {
            isUserLogged: req.isAuthenticated(),
            username: req.user ? req.user.username : null
        });



})




app.get("/signup", async (req, res) => {

    if (req.isAuthenticated()) {
        res.redirect("/profile");
    } else {
        res.render("signup");
    }
});

//enregistre les valeurs qu'on rentre dans les inputs du signup:

app.post("/signup", (req, res, next) => {
    const { username, password, firstName, surname } = req.body;
    console.log("req.body signup", req.body)
    User.create({
        username,
        password,
        firstName,
        surname
    }, (err, user) => {
        if (err) {
            return res.status(500).send(err)
        }
        next()
    })
}, passport.authenticate("local"), (req, res) => res.redirect("/profile"))


app.get("/profile", (req, res) => {
    console.log("GET /profile");
    if (req.isAuthenticated()) {
        console.log(req.user);
        res.render("profile", {
            username: req.user.username,
            surname: req.user.surname,
            firstName: req.user.firstName,
            isUserLogged: req.isAuthenticated()

        }); console.log("firstName dans profile", req.user.firstName)
    } else {
        res.redirect("/");
    }
});

/* 
app.post('/profile',
    body("username").isEmail(),
    body("password").isLength({ min: 1 }), 
    async (req, res) => {
        const errors = validationResult(req);
        if (errors.isEmpty() === false) {
            res.json({
                errors: errors.array() // to be used in a json loop
            });
            return;
        } else {
            res.json({
                success: true,
                message: 'User will be saved'
            });
        }
    }
);  */





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



app.get("/logout", (req, res) => {
    // console.log("GET /logout", req);
    req.logout();
    res.redirect("/");


});




app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});
