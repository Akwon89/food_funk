var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('board',{ title: "Main Board" });

});

module.exports = router;