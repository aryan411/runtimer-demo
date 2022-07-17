let mongoose = require('mongoose');

// create a model class
let surveyModel = mongoose.Schema({
  user: String, // user's id
  
  name: String,
  dateCreated:
  {
    type: String,
    default: new Date().toISOString()
  },
  dateActive:
  {
    type: String,
    default: new Date().toISOString()
  },
  dateExpire: {type: String, default: ''}
  ,
  responses:
  {
    type: Number,
    default: 0
  },
  questions: [{
    title: String,
    optionType: String,
    options: [{
      details: String,
      count:{ 
        type: Number, 
        default: 0
      }
    }]
  }]
},
{
    collection: "surveys"
});

const survey = mongoose.model('Survey', surveyModel);
export default survey;