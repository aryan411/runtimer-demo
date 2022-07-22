/* GET home page. */
import express from "express";
const router = express.Router();
import * as surveyController from "../Controllers/survey";
import jwt from "jsonwebtoken";
import passport from "passport";

// GET List of surveys
router.get("/", surveyController.getSurveys);

// get Active Surves
router.get("/active", surveyController.getActiveSurveys);

// GET survey by id
router.get("/:id", surveyController.getSurvey);

// POST update survey by id
router.post("/take/:id", surveyController.takeSurvey);

// POST add survey
router.post("/add", surveyController.addSurvey); // passport.authenticate('jwt', {session: false})

// POST update survey by id
router.post("/update/:id", surveyController.updateSurvey); //passport.authenticate('jwt', {session: false})

// POST delete survey by id
router.post("/delete", surveyController.deleteSurvey); //passport.authenticate('jwt', {session: false}),

export default router;
