const express = require("express");
const exphbs = require("express-handlebars");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo")(expressSession);
const mongoose = require("mongoose");
const { session } = require("passport");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
//appeler la fonction calculatrice d'age qui se trouve dans age.js :
const ageFunc = require("./age")

const port = 3000;

mongoose.connect(
    "mongodb://localhost:27017/authentication_exercise",
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }
);

const app = express();

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
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
);


// enable Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(
    new LocalStrategy(
        // User.authenticate()))
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, done) => {
            console.log("email", email);
            console.log("password", password);
            console.log("done", done);
            try {
                const user = await User.findOne({ email })
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



// Passport configuration
passport.serializeUser(User.serializeUser()); // Save the user.id to the session
passport.deserializeUser(User.deserializeUser()); // Receive the user.id from the session and fetch the User from the DB by its ID

app.get("/", (req, res) => {
    
    res.render("home");
});



app.get("/admin", (req, res) => {
    console.log("GET /admin");
    if (req.isAuthenticated()) {
        console.log(req.user);
        res.render("admin", {
            surname: req.user.surname,
            firstName: req.user.firstName,
            birthDate: ageFunc(req.user.birthDate),
        });
    } else {
        res.redirect("/");
    }
});




app.get("/signup", async (req, res) => {
    // console.log("GET /signup");
    // console.log(1);
    if (req.isAuthenticated()) {
        res.redirect("/admin");
    } else {
        res.render("signup");
    }
});

// app.post("/signup", (req, res, next) => {
//   // console.log(2);

//   console.log("POST /signup");
//   // create a user with the defined model with
//   // req.body.username, req.body.password
//   console.log("will signup");

//   const username = req.body.username;
//   const email = req.body.email;
//   const password = req.body.password;
//   const confirm_password = req.body.confirm_password;
//   const firstname = req.body.firstname;
//   const surname = req.body.surname;
//   const date = req.body.date;

//   User.create(
//     {
//       username: username,
//       email: email,
//       password: password,
//       // confirm_password: confirm_password,
//       firstname: firstname,
//       surname: surname,
//       date: date,
//     },
//     (err, user) => {
//       console.log('user', user);
//       passport.authenticate("local")((req, res) => {
//         res.redirect("/admin");
//       }
//       )
//     }
//   )
// })



app.post("/signup", (req, res, next) => {
    const { username, email, password, firstName } = req.body;
    User.create({
        username,
        email,
        password,
        firstName,
    }, (err, user) => {
        if (err) {
            return res.status(500).send(err)
        }
        next()
    })
}, passport.authenticate("local"), (req, res) => res.redirect("/admin"))




app.get("/login", (req, res) => {
    // console.log('req.isAuthenticated',req.isAuthenticated);

    if (req.isAuthenticated()) {
        res.redirect("/admin");
    } else {
        res.render("login");
    }
});


// app.post("/login", (req, res, next) => {
//   const { username, email, password, firstname} = req.body;
//   session.create({
//       username,
//       email,
//       password,
//       firstname
//   }, (err, user) => {
//       if (err) {
//           return res.status(500).send(err)
//       }
//       next()
//   })
// }, passport.authenticate("local"), (req, res) => res.redirect("/admin"))


app.post(
    "/login",
    // console.log('APPPOST', passport.authenticate),
    passport.authenticate("local", {
        successRedirect: "/admin",
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
