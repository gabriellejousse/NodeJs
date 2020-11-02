const express = require('express');
var exphbs  = require('express-handlebars');

const app = express();

const port = 3001;



app.engine('handlebars', exphbs({
    defaultLayout:false,
    layoutsDir: __dirname + '/views'
}));

app.set('view engine', 'handlebars')


app.get('/', (req, res) => {
    console.log('route /')
    res.render('home', {
        title:'Bonjour',
        message:'hello world'
    });
  });



// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// parse application/json
app.use(express.json());

app.post('/form/signup', (req, res) => {
    console.log(req.body.username); 
  });


app.listen(port, () => {
  console.log('Server started on port: ' + port);
});