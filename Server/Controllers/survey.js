"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSurvey = exports.takeSurvey = exports.updateSurvey = exports.addSurvey = exports.getSurvey = exports.getActiveSurveys = exports.getSurveys = void 0;
const survey_1 = __importDefault(require("../Models/survey"));
const user_1 = __importDefault(require("../Models/user"));
const User = user_1.default;
function getSurveys(req, res, next) {
    const promises = [];
    survey_1.default.find((err, surveys) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        else {
            const filteredSurveys = surveys.filter((survey) => survey.user);
            filteredSurveys.forEach((survey, i) => {
                const promise = User.findById({ _id: survey.user }, (err, foundUser) => {
                    if (err) {
                        console.error(err);
                    }
                })
                    .clone()
                    .exec();
                promises.push(promise);
            });
            Promise.all(promises)
                .then((values) => {
                let surveysToReturn = [];
                filteredSurveys.forEach((survey, index) => {
                    var _a;
                    surveysToReturn.push(Object.assign(Object.assign({}, survey._doc), { displayName: (_a = values[index]) === null || _a === void 0 ? void 0 : _a.displayName }));
                });
                surveysToReturn.sort((a, b) => (a._id < b._id ? 1 : -1));
                res.json({
                    error: err,
                    data: surveysToReturn,
                });
            })
                .catch();
        }
    });
}
exports.getSurveys = getSurveys;
function getActiveSurveys(req, res, next) {
    const promises = [];
    survey_1.default.find((err, surveys) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        else {
            const filteredSurveys = surveys.filter((survey) => (!survey.dateActive ||
                survey.dateActive != "") &&
                (new Date(survey.dateExpire) >= new Date() ||
                    survey.dateExpire == "" ||
                    !survey.dateExpire));
            filteredSurveys.forEach((survey, i) => {
                const promise = User.findById({ _id: survey.user }, (err, foundUser) => {
                    if (err) {
                        console.error(err);
                    }
                })
                    .clone()
                    .exec();
                promises.push(promise);
            });
            Promise.all(promises)
                .then((values) => {
                let surveysToReturn = [];
                filteredSurveys.forEach((survey, index) => {
                    var _a;
                    surveysToReturn.push(Object.assign(Object.assign({}, survey._doc), { displayName: (_a = values[index]) === null || _a === void 0 ? void 0 : _a.displayName }));
                });
                surveysToReturn.sort((a, b) => (a._id < b._id ? 1 : -1));
                res.json({
                    error: err,
                    data: surveysToReturn,
                });
            })
                .catch();
        }
    });
}
exports.getActiveSurveys = getActiveSurveys;
function getSurvey(req, res, next) {
    let id = req.params.id;
    survey_1.default.findById({ _id: id }, (err, foundSurvey) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        else {
            res.json({
                error: err,
                data: foundSurvey,
            });
        }
    });
}
exports.getSurvey = getSurvey;
function addSurvey(req, res, next) {
    let newSurvey = (0, survey_1.default)({
        user: req.body.user,
        name: req.body.name,
        dateCreated: req.body.dateCreated,
        dateActive: req.body.dateActive,
        dateExpire: req.body.dateExpire,
        responses: req.body.responses,
        questions: req.body.questions,
    });
    survey_1.default.create(newSurvey, (err, survey) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        else {
            res.json({
                error: err,
                data: survey,
            });
        }
    });
}
exports.addSurvey = addSurvey;
function updateSurvey(req, res, next) {
    let id = req.params.id;
    let userID = req.body.userID;
    let survey = (0, survey_1.default)({
        _id: id,
        user: req.body.survey.user,
        name: req.body.survey.name,
        dateCreated: req.body.survey.dateCreated,
        dateActive: req.body.survey.dateActive,
        dateExpire: req.body.survey.dateExpire,
        responses: req.body.survey.responses,
        questions: req.body.survey.questions,
    });
    if (survey.user === userID) {
        survey_1.default.updateOne({ _id: id }, survey, (err) => {
            if (err) {
                console.error(err);
                res.end(err);
            }
            else {
                res.json({ error: err });
            }
        });
    }
    else {
        res.json({ error: "Failed to update messgage" });
    }
}
exports.updateSurvey = updateSurvey;
function takeSurvey(req, res, next) {
    let id = req.params.id;
    let updatedQuestions = req.body.questions;
    survey_1.default.findById({ _id: id }, (err, survey) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        else {
            survey.responses++;
            survey.questions.forEach((question, i) => {
                question.options.forEach((option, j) => {
                    if (updatedQuestions[i].options[j].count > 0) {
                        option.count++;
                    }
                });
            });
            survey.save();
            res.json({
                error: err,
            });
        }
    });
}
exports.takeSurvey = takeSurvey;
function deleteSurvey(req, res, next) {
    let id = req.body.survey._id;
    let userID = req.body.userID;
    let surveyUser = req.body.survey.user;
    if (surveyUser === userID) {
        survey_1.default.remove({ _id: id }, (err) => {
            if (err) {
                console.error(err);
                res.end(err);
            }
            else {
                res.json({
                    error: err,
                });
            }
        });
    }
    else {
        res.json({ error: "Failed to delete survey" });
    }
}
exports.deleteSurvey = deleteSurvey;
//# sourceMappingURL=survey.js.map