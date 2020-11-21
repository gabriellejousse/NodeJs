const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  res.send('list of products');
});

// router.get('/:id', function(req, res) {
//   res.send('products id: ' + req.params.id);
// });

module.exports = router;
