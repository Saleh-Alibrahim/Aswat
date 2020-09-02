const express = require('express');
const router = express.Router();
const { getCreateView, createPoll } = require('../controllers/createController');



router.get('/', getCreateView);

router.post('/', createPoll);






module.exports = router;
