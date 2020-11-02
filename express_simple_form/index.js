const express = require('express');
var exphbs  = require('express-handlebars');

const app = express();

const port = 3002;

app.engine('handlebars', exphbs({
    defaultLayout:false,
    layoutsDir: __dirname + '/views/'
}));

app.set('view engine', 'handlebars')

app.use(express.static('views'));

app.get('/', (req, res) => {
    console.log('route /')
    res.render('home', {
        title: 'Welcome to express simple form'
    });
  });



  // parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// parse application/json
app.use(express.json());

app.listen(port, () => {
    console.log('Server started on port: ' + port);
  });