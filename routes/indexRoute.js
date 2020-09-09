const express = require('express');
const router = express.Router();

const { getMainView, getPoll,
  getPollResult, sendEmail } = require('../controllers/indexController');

const { getLoginUser } = require('../middleware/auth');


router.get('/', getMainView);


router.get('/:id', getPoll);

router.get('/:id/r', getLoginUser, getPollResult);

router.post('/mail', sendEmail);



module.exports = router;
