var express = require('express');
var router = express.Router();

// @desc    Landing page
// @route   GET /
router.get('/', function (req, res) {
  res.render('main');
});

// @desc    Landing page
// @route   POST /create_poll
router.post('/create_poll', function (req, res, next) {
  const { title, poll_list } = req.body;

});



module.exports = router;
