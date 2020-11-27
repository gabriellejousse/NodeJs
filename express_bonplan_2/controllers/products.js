const express = require('express');
const router = express.Router();
const multer = require('multer');





router.get('/', function(req, res) {
  res.render('products');
});

// router.get('/:id', function(req, res) {
//   res.send('products id: ' + req.params.id);
// });

module.exports = router;
