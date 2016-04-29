var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('video',{ title: "video" });

});

module.exports = router;