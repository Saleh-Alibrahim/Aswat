const express = require('express');
const router = express.Router();

// Controllers 
const { getMainView, getPoll, sendEmail } = require('../controllers/mainController');
const { getPollResult, getResultAccses } = require('../controllers/resController');
const { getCreateView, createPoll } = require('../controllers/createController');
const { addVote } = require('../controllers/voteController');

// Middleware
const { getLoginUser } = require('../middleware/auth');


router.get('/', getMainView);

router.route('/create')
  .get(getCreateView)
  .post(getLoginUser, createPoll);

router.get('/:id', getPoll);

router.get('/:id/r', getLoginUser, getPollResult);

router.get('/:id/resultAccess', getLoginUser, getResultAccses);

router.post('/mail', sendEmail);

router.post('/vote', addVote);




module.exports = router;
