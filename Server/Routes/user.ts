import express from 'express';
const router = express.Router();
import * as userController from '../Controllers/user';
import jwt from 'jsonwebtoken';
import passport from 'passport';

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

/* POST Route for processing the Login page */
router.post('/login', userController.processLoginPage);

/* POST Route for processing the Register page */
router.post('/register', userController.processRegisterPage);

/* POST Route for processing the Register page */
router.post('/update', userController.processUpdateUser); //passport.authenticate('jwt', {session: false})

/* GET to perform UserLogout */
router.get('/logout', userController.performLogout);

export default router;
