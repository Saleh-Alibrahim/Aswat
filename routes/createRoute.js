const express = require('express');
const router = express.Router();
const { getCreateView, createPoll } = require('../controllers/createController');
const { getLoginUser } = require('../middleware/auth');



router.get('/', getCreateView);

router.post('/', getLoginUser, createPoll);






module.exports = router;
