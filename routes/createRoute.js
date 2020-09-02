const express = require('express');
const router = express.Router();
const { getCreateView, createPoll } = require('../controllers/createController');

// @desc    Render the create poll page
// @route   GET /create
router.get('/', getCreateView);

// @desc    Create Poll
// @route   POST /create
router.post('/', createPoll);






module.exports = router;
