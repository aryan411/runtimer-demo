/* GET home page. */
import express from 'express';
const router = express.Router();
import * as surveyController from '../Controllers/survey';
import jwt from 'jsonwebtoken';
import passport from 'passport';

// GET List of surveys
router.get('/', surveyController.getSurveys);

// GET survey by id
router.get('/:id', surveyController.getSurvey);

// POST update survey by id 
router.post('/take/:id', surveyController.takeSurvey);

// POST add survey
router.post('/add', passport.authenticate('jwt', {session: false}), surveyController.addSurvey);

// POST update survey by id 
router.post('/update/:id', passport.authenticate('jwt', {session: false}), surveyController.updateSurvey);

// POST delete survey by id
router.post('/delete', passport.authenticate('jwt', {session: false}), surveyController.deleteSurvey);

export default router;