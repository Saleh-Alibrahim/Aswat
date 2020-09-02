const express = require('express');
const router = express.Router();
const checkRecaptcha = require('../utils/recaptcha');
const { addVote } = require('../controllers/voteController');


router.post('/', addVote);

module.exports = router;
