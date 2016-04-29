var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('user-form',{ title: "user-form" });

});

module.exports = router;