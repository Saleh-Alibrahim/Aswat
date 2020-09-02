const express = require('express');
const router = express.Router();

const { getMainView, getPoll,
  getPollResult, sendEmail } = require('../controllers/indexController')


router.get('/', getMainView);

router.get('/:id', getPoll);

router.get('/:id/r', getPollResult);

router.post('/mail', sendEmail);



module.exports = router;
