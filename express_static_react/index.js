const express = require('express');
const app = express();

const port = 3001;

app.use(express.static('public'));


app.get('/', (req, res) => {
    res.send('Beautiful homepage');
  });


app.listen(port, () => {
  console.log('Server started on port: ' + port);
});