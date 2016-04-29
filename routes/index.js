var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "Food Foonk" });
});


router.get('/:room', function(req, res, next) {
  res.render('user-page', { newRoom: req.params.room });
});

// router.get('/:roomName', function(req, res, next) {
//   console.log(req);
//   res.render('index', { title: "Food Foonk" });
// });

module.exports = router;
