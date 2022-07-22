import Survey, { Questions } from "../Models/survey";
import userModel from "../Models/user";
const User = userModel; // alias
import passport from "passport";

export function getSurveys(req: any, res: any, next: any): void {
  // console.log("get survays");
  const promises: any[] = [];
  // res.json({hii:"hiii"});
  Survey.find((err: any, surveys: any[]) => {
    if (err) {
      console.error(err);
      res.end(err);
    } else {
      const filteredSurveys = surveys.filter(
        (survey: { user: any }) => survey.user,
      );
      // updating returned surveys to include displayName of user
      filteredSurveys.forEach((survey: { user: any }, i: any) => {
        // handle asynchronous function
        const promise = User.findById(
          { _id: survey.user },
          (err: any, foundUser: any) => {
            if (err) {
              console.error(err);
            }
          },
        )
          .clone()
          .exec();

        promises.push(promise);
      });

      Promise.all(promises)
        .then((values: any) => {
          let surveysToReturn: any[] = [];
          filteredSurveys.forEach(
            (survey: { _doc: any }, index: string | number) => {
              surveysToReturn.push({
                ...survey._doc, // destructuring survey object from db
                displayName: values[index]?.displayName,
              });
            },
          );

          // sort by id
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

export function getActiveSurveys(req: any, res: any, next: any): void {
  // console.log("get survays");
  const promises: any[] = [];
  // res.json({hii:"hiii"});
  Survey.find((err: any, surveys: any[]) => {
    if (err) {
      console.error(err);
      res.end(err);
    } else {
      const filteredSurveys = surveys.filter(
        (survey: any) =>
          (!survey.dateActive ||
          survey.dateActive != "" )&&
          // // new Date(survey.dateActive) >= new Date() &&
          (new Date(survey.dateExpire) >= new Date() ||
            survey.dateExpire == "" ||
            !survey.dateExpire),
      );
      // updating returned surveys to include displayName of user
      filteredSurveys.forEach((survey: { user: any }, i: any) => {
        // handle asynchronous function
        const promise = User.findById(
          { _id: survey.user },
          (err: any, foundUser: any) => {
            if (err) {
              console.error(err);
            }
          },
        )
          .clone()
          .exec();

        promises.push(promise);
      });

      Promise.all(promises)
        .then((values: any) => {
          let surveysToReturn: any[] = [];
          filteredSurveys.forEach(
            (survey: { _doc: any }, index: string | number) => {
              surveysToReturn.push({
                ...survey._doc, // destructuring survey object from db
                displayName: values[index]?.displayName,
              });
            },
          );

          // sort by id
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

export function getSurvey(
  req: { params: { id: any } },
  res: {
    end: (arg0: any) => void;
    json: (arg0: { error: any; data: any }) => void;
  },
  next: any,
) {
  let id = req.params.id;

  Survey.findById({ _id: id }, (err: any, foundSurvey: any) => {
    if (err) {
      console.error(err);
      res.end(err);
    } else {
      res.json({
        error: err,
        data: foundSurvey,
      });
    }
  });
}

export function addSurvey(
  req: {
    body: {
      user: any;
      name: string;
      dateCreated?: any;
      dateActive?: any;
      dateExpire?: any;
      responses?: number;
      questions?: Questions;
    };
  },
  res: {
    end: (arg0: any) => void;
    json: (arg0: { error: any; data: any }) => void;
  },
  next: any,
) {
  // console.log("hiii");

  let newSurvey = Survey({
    user: req.body.user,
    name: req.body.name,
    dateCreated: req.body.dateCreated,
    dateActive: req.body.dateActive,
    dateExpire: req.body.dateExpire,
    responses: req.body.responses,
    questions: req.body.questions,
  });

  Survey.create(newSurvey, (err: any, survey: any) => {
    if (err) {
      console.error(err);
      res.end(err);
    } else {
      res.json({
        error: err,
        data: survey,
      });
    }
  });
}

export function updateSurvey(
  req: {
    params: { id: any };
    body: {
      userID: any;
      survey: {
        user: any;
        name: any;
        dateCreated: any;
        dateActive: any;
        dateExpire: any;
        responses: any;
        questions: any;
      };
    };
  },
  res: { end: (arg0: any) => void; json: (arg0: { error: any }) => void },
  next: any,
) {
  // the req body has two objects: survey and user
  let id = req.params.id;
  let userID = req.body.userID;
  let survey = Survey({
    _id: id,
    user: req.body.survey.user,
    name: req.body.survey.name,
    dateCreated: req.body.survey.dateCreated,
    dateActive: req.body.survey.dateActive,
    dateExpire: req.body.survey.dateExpire,
    responses: req.body.survey.responses,
    questions: req.body.survey.questions,
  });

  //prevent users from updating if survey is not theirs
  if (survey.user === userID) {
    Survey.updateOne({ _id: id }, survey, (err: any) => {
      if (err) {
        console.error(err);
        res.end(err);
      } else {
        res.json({ error: err });
      }
    });
  } else {
    res.json({ error: "Failed to update messgage" });
  }
}

export function takeSurvey(
  req: { params: { id: any }; body: { questions: any } },
  res: { end: (arg0: any) => void; json: (arg0: { error: any }) => void },
  next: any,
) {
  let id = req.params.id;
  // bellow stores questions with responses
  let updatedQuestions = req.body.questions;

  Survey.findById(
    { _id: id },
    (
      err: any,
      survey: { responses: number; questions: any[]; save: () => void },
    ) => {
      if (err) {
        console.error(err);
        res.end(err);
      } else {
        // update response count
        survey.responses++;
        // update options count
        survey.questions.forEach((question: { options: any[]; }, i: string | number) => {
          question.options.forEach((option: { count: number; }, j: string | number) => {
            if (updatedQuestions[i].options[j].count > 0)
            {
              option.count++;
            }
          });
        });
        survey.save();

        res.json({
          error: err,
        });
      }
    },
  );
}

export function deleteSurvey(
  req: { body: { survey: { _id: any; user: any }; userID: any } },
  res: { end: (arg0: any) => void; json: (arg0: { error: any }) => void },
  next: any,
) {
  let id = req.body.survey._id;
  let userID = req.body.userID;
  let surveyUser = req.body.survey.user;

  if (surveyUser === userID) {
    Survey.remove({ _id: id }, (err: any) => {
      if (err) {
        console.error(err);
        res.end(err);
      } else {
        res.json({
          error: err,
        });
      }
    });
  } else {
    res.json({ error: "Failed to delete survey" });
  }
}
