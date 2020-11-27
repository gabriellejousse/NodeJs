const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  res.send('list of users');
});

// router.get('/:id', function(req, res) {
//   res.send('users id: ' + req.params.id);
// });

module.exports = router;
