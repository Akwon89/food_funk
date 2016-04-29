var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:room', function(req, res, next) {
  res.redirect('user-page', { newRoom: req.params.room });
});

module.exports = router;
