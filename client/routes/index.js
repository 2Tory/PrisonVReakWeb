var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/game', function(req, res) {
  res.render('gamepage');
});

module.exports = router;
