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
const port = 3002;

const validationResult = expressValidator.validationResult;
const body = expressValidator.body;

const app = express();

let usersRoutes = require('./controllers/users');
app.use('/users', usersRoutes);

let productsRoutes = require('./controllers/products');
app.use('/products', productsRoutes);


mongoose.connect(
    "mongodb://localhost:27017/bonPlan",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }
);


// Express configuration

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// enable session management
app.use(
    expressSession({
      secret: "konexioasso07",
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection })
    })
  );



// enable Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
// passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // Save the user.id to the session
passport.deserializeUser(User.deserializeUser()); // Receive the user.id from the session and fetch the User from the DB by its ID


passport.use(
    new LocalStrategy(
        // User.authenticate()))
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
    res.render('home')
})

app.get("/profile", (req, res) => {
    console.log("GET /profile");
    if (req.isAuthenticated()) {
        console.log(req.user);
        res.render("profile" , {
            username: req.user.username
        });
    } else {
        res.redirect("/");
    }
});


/* 
app.get('/signup', (req, res) => {
    res.render('signup')
}) */

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

/* app.get("/profile", async (req,res) => {
    res.render('profile')

})
 */

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



app.get('/login', async  (req, res) => {
    res.render('login')
})


app.get("/login", (req, res) => {
    // console.log('req.isAuthenticated',req.isAuthenticated);

    if (req.isAuthenticated()) {
        res.redirect("/");
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
  