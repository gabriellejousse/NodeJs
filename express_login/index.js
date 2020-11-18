const express = require("express");
const exphbs = require("express-handlebars");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo")(expressSession);
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
//appeler la fonction calculatrice d'age qui se trouve dans age.js :
const ageFunc = require("./age")

const port = process.env.PORT || 3000;

mongoose.connect(
    process.env.MONGODB_URI ||
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
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    })
);

// enable Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // Save the user.id to the session
passport.deserializeUser(User.deserializeUser()); // Receive the user.id from the session and fetch the User from the DB by its ID

app.get("/", (req, res) => {
    console.log("GET /");
    res.render("home");
});




app.get("/admin", (req, res) => {
    console.log("GET /admin");

    if (req.isAuthenticated()) {
        console.log("coucou", req.user);
        res.render("admin", {
            firstName: req.user.firstName,
            surname: req.user.surname,
            //appeler la fonction importée depuis age.js avec la date qu'on rentre dans l'input du formulaire en paramètre:
            birthDate: ageFunc(req.user.birthDate) + " ans"
        });
    } else {
        res.redirect("/");
    }
});




app.get("/signup", (req, res) => {
    //console.log("GET /signup");
    if (req.isAuthenticated()) {
        res.redirect("/admin");
    } else {
        res.render("signup");
    }

});

app.post("/signup", (req, res) => {
    console.log("POST /signup");
    // create a user with the defined model with
    // req.body.username, req.body.password

    console.log("will signup");


    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;
    const firstName = req.body.firstName;
    const surname = req.body.surname;
    const birthDate = req.body.birthDate;



/* function ageCalculator() {
        var today = new Date();
        var age = 0;
        var birthday = new Date(req.body.birthDate)
    
        age = today.getFullYear() - birthday.getFullYear();
    
        return age;
    }
    console.log(ageCalculator() + 'ans');
 */

    User.register(
        new User({
            username: username,
            email: email,
            password: password,
            passwordConfirm: passwordConfirm,
            firstName: firstName,
            surname: surname,
            birthDate: birthDate
        }),
        password, // password will be hashed
        (err, user) => {
            if (password !== passwordConfirm) {
                console.log("/signup user register err", err);
                return res.render("signup");
            } else {
                passport.authenticate("local")(req, res, () => {
                    res.redirect("/admin");
                    console.log(birthDate)
                    console.log(typeof birthDate)

                });
            }
        }
    );
});

app.get("/login", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("/admin");
    } else {
        res.render("login");
    }
});

app.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/admin",
        failureRedirect: "/login"
    })
);

// Without Passport

// app.post("/login", (req, res) => {
//   const md5 = require("md5"); // there for education purpose, if using this method, put it in the top of your file
//   User.find(
//     {
//       username: req.body.username,
//       password: md5(req.body.password)
//     },
//     (users) => {
//       // create a session cookie in the browser
//       // if the password is good
//       // and redirect to /admin
//     }
//   );
//   res.send("login");
// });

app.get("/logout", (req, res) => {
    console.log("GET /logout");
    req.logout();
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});
