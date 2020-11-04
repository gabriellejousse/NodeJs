const express = require('express');
const app = express();

const port = 3003;


const arrAuthors = ['Lawrence Nowell', 'William Shakespeare', 'Charles Dickens', 'Oscar Wilde']
const arrBooks = ['Beowulf', 'Hamlet, Othello, Romeo and Juliet MacBeth',
    'Oliver Twist, A Christmas Carol', 'The Picture of Dorian Gray, The Importance of Being Earnest']
const arrCountries = ['UK', 'UK', 'US', 'UK']


// ex 0 :

app.get('/', (req, res) => {
    res.send('Authors API');
});

// ex 1 : 

// utiliser les params dynamiques (:num etc) pour éviter de faire un app.get pour chaque auteur 

app.get('/authors/:id/', (req, res) => {
    res.send(arrAuthors[req.params.id - 1])

})

// ex 2 :

// utiliser les params dynamiques (:num etc) pour éviter de faire un app.get pour chaque book

app.get('/authors/:id/books/', (req, res) => {
    res.send(arrBooks[req.params.id - 1])
})


//ex 4 :

const authorsObj = [
    {
        name: 'Lawrence Nowell',
        country: 'UK'
    },
    {
        name: 'William Shakespeare',
        country: 'UK'
    },
    {
        name: 'Charles Dickens',
        country: 'US'
    },
    {
        name: 'Oscar Wilde',
        country: 'UK'
    }
]

const booksObj = [
    {
        book: ['Beowulf']
    },
    {
        book: ['Hamlet, Othello, Romeo and Juliet, MacBeth']
    },
    {
        book: ['Oliver Twist, A Christmas Carol']
    }, 
    {
        book: ['The Picture of Dorian Gray, The Importance of Being Earnest']
    }
] 

app.get('/json/authors/:id/books/', (req, res) => {

    const newBooks = {
        books: booksObj[req.params.id -1].book
    }
    console.log("NewBooks", newBooks)
    res.json(newBooks)
})


//
app.get('/json/authors/:id/', (req, res) => {
    
    const newAuthors = {
        name: authorsObj[req.params.id -1].name,
        country: authorsObj[req.params.id -1].country
    }
    console.log("newAuthors", newAuthors)
    res.json(newAuthors)

})




//faire .json 


// ex 3 :

// gestion d'erreur sur les pages d'auteurs :

// app.get('/authors/:*/', (req, res) => {
//     res.send(`The author with the ID ${req.params.*} does not exist`);
// });

app.get('/authors/:id/', function (req, res, next) {
    //si l'id de l'url est > 4, renvoyer un message d'erreur avec le nom de l'id problématique:
    const id= req.params.id
    if (id > authorsObj.length) {
        res.send(`error ID ${id}`)
        console.log(`error ID ${id}`)
    } else {
        res.send(authorsObj[id - 1]);
    }
});

//gestion d'erreur sur ttes les pages :
app.get('*', (req, res) => {
    res.send('error');
});


// partie "instructions" :
app.listen(port, () => {
    console.log('Server started on port:' + port);
})