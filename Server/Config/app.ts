// modules for node and express
import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import flash from "connect-flash";

// modules for authentication
import session from "express-session";
import passport from "passport";
import passportJWT from "passport-jwt";
import passportLocal from "passport-local";

// import "mongoose" - required for DB Access
import mongoose, { mongo, PassportLocalModel } from "mongoose";

// URI
import * as DBConfig from "./db";

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const localStrategy = passportLocal.Strategy;

// database setup
mongoose.connect(DBConfig.RemoteURI);
const db = mongoose.connection; // alias for the mongoose connection

db.on("error", function () {
  console.error("connection error");
});

db.once("open", function () {
  console.log(`Connected to MongoDB at: ${DBConfig.HostName}`);
});

// define routers
// import index from "../Routes/index"; // top level routes
import usersRouter from '../Routes/user'
import surveysRouter from "../Routes/survey"; // routes for surveys

// Express Web App Configuration
const app = express();

// view engine setup
// app.set("views", path.join(__dirname, "../Views"));
// app.set("view engine", "ejs");

// uncomment after placing your favicon in /client
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../../Public")));
app.use(express.static(path.join(__dirname, "../../node_modules")));

app.use(cors());

// setup express session
app.use(
  session({
    secret: "SomeSecret",
    saveUninitialized: false,
    resave: false,
  }),
);

// initialize flash
// app.use(flash());

//* initialize passport
app.use(passport.initialize());
app.use(passport.session());

// create a user model instance
import userModel from "../Models/user";
const User = userModel as mongoose.PassportLocalModel<any>;

//* implement a User Authentication Strategy
passport.use(User.createStrategy());

//* serialize and deserialize the User info
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//* To verify whether the token is being sent by the user and is valid*/
let jwtOptions: { jwtFromRequest: any; secretOrKey: any } = {};
jwtOptions["jwtFromRequest"] = ExtractJWT.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = DBConfig.Secret;

//* find user from database
let strategy = new JWTStrategy(jwtOptions, (jwt_payload: any, done) => {
  User.findById(jwt_payload.id)
    .then((user: any) => {
      return done(null, user);
    })
    .catch((err: any) => {
      return done(err, false);
    });
});

// routing
// app.use('/api', indexRouter);
app.use("/api/user", usersRouter);
app.use("/api/survey", surveysRouter);
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, "../../public/index.html"));
// });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (
  err: createError.HttpError,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app; // exports app as the default Object for this module
