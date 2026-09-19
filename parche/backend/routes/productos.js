var express = require('express');
var router = express.Router();
var db = require('../db'); // tu conexión a MySQL, ajusta el nombre

router.get('/', function(req, res, next) {
  db.query('SELECT * FROM productos', function(err, results) {
    if (err) return next(err);
    res.json(results);
  });
});

module.exports = router;