const express = require('express');
const router = express.Router();
const { addVote } = require('../controllers/voteController');

router.post('/', addVote);

module.exports = router;
