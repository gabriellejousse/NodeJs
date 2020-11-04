const express = require('express');
var exphbs = require('express-handlebars');

const app = express();

const port = 3002;

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));


app.engine('handlebars', exphbs({
    defaultLayout: false,
    layoutsDir: __dirname + '/views/'
}));

app.set('view engine', 'handlebars')


const students = [];

app.use(express.static('views'));

app.get('/', (req, res) => {

    res.render('home', {
        title: 'Student name :',
        students: students,
        titleList: 'Students list : '
    });
});

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// parse application/json
app.use(express.json());


app.post('/students/add', (req, res) => {
   let username = req.body.username;
   console.log(username)
    students.push(username);
    res.render('studentsadd', {
        username: username
    })

});




app.listen(port, () => {
    console.log('Server started on port: ' + port);
});