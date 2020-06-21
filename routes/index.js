var express = require('express');
var router = express.Router();

// @desc    Landing page
// @route   GET /
router.get('/', function (req, res) {
  res.render('main');
});

// @desc    Landing page
// @route   POST /create_poll
router.get('/create_poll', function (req, res, next) {
  res.render('index', { title: 'Express' });
});



module.exports = router;
