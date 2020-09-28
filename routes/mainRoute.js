const express = require('express');
const router = express.Router();

// Controllers 
const { getMainView, getPoll, deletePoll, dashboard, settings, sendEmail } = require('../controllers/mainController');
const { getPollResult, getResultAccses } = require('../controllers/resController');
const { getCreateView, createPoll } = require('../controllers/createController');
const { addVote } = require('../controllers/voteController');

// Middleware
const { protect, getLoginUser } = require('../middleware/auth');


router.get('/', getMainView);

router.route('/create')
  .get(getCreateView)
  .post(getLoginUser, createPoll);


router.get('/dashboard', getLoginUser, dashboard);

router.get('/settings', protect, settings);

router.get('/:id', getPoll);

router.post('/vote', addVote);

router.get('/:id/r', getLoginUser, getPollResult);

router.get('/:id/resultAccess', getLoginUser, getResultAccses);

router.post('/mail', sendEmail);


router.delete('/:id', getLoginUser, deletePoll);




module.exports = router;
