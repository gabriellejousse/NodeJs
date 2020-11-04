const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const port = 3003;

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));


app.engine('handlebars', exphbs({
    defaultLayout: false,
    layoutsDir: __dirname + '/views/'
}));

app.set('view engine', 'handlebars')


app.get('/:lang?', (req, rest) => {

    res.render('home', {

    })
})


app.listen(port, () => {
    console.log('Server started on port: ' + port);
});