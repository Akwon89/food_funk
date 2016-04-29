var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('landing',{ title: "landing" });

});

module.exports = router;