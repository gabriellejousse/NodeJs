const express = require('express');
const app = express();

const port = 3001;


const arrAuthors = ['Lawrence Nowell, UK', 'William Shakespeare, UK', 'Charles Dickens, US', 'Oscar Wilde, UK']
const arrBooks = ['Beowulf', 'Hamlet, Othello, Romeo and Juliet, MacBeth',
'Oliver Twist, A Christmas Carol', 'The Picture of Dorian Gray, The Importance of Being Earnest']

// ex 0 :

app.get('/', (req, res) => {
    res.send('Authors API');
  });

// ex 1 : 

// utiliser les params dynamiques (:num etc) pour éviter de faire un app.get pour chaque auteur 

app.get('/authors/:numAuthors/', (req, res) => {
    res.send(arrAuthors[req.params.numAuthors - 1])

})

// ex 2 :

// utiliser les params dynamiques (:num etc) pour éviter de faire un app.get pour chaque book

app.get('/authors/:numBooks/books/', (req, res) => {
    res.send(arrBooks[req.params.numBooks - 1])
})


// ex 3 :

// gestion d'erreur sur les pages d'auteurs :
app.get('/authors/*', (req, res) => {
    res.send(`The author with the ID _ does not exist`);
});

//gestion d'erreur sur ttes les pages :
app.get('*', (req, res) => {
    res.send('error');
});

//ex 4 :


app.listen(port, () => {
    console.log('Server started on port:' + port);
})