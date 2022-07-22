"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const passport_local_1 = __importDefault(require("passport-local"));
const mongoose_1 = __importDefault(require("mongoose"));
const DBConfig = __importStar(require("./db"));
const JWTStrategy = passport_jwt_1.default.Strategy;
const ExtractJWT = passport_jwt_1.default.ExtractJwt;
const localStrategy = passport_local_1.default.Strategy;
mongoose_1.default.connect(DBConfig.RemoteURI);
const db = mongoose_1.default.connection;
db.on("error", function () {
    console.error("connection error");
});
db.once("open", function () {
    console.log(`Connected to MongoDB at: ${DBConfig.HostName}`);
});
const user_1 = __importDefault(require("../Routes/user"));
const survey_1 = __importDefault(require("../Routes/survey"));
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "../../Public")));
app.use(express_1.default.static(path_1.default.join(__dirname, "../../node_modules")));
app.use((0, cors_1.default)());
app.use((0, express_session_1.default)({
    secret: "SomeSecret",
    saveUninitialized: false,
    resave: false,
}));
app.use((0, connect_flash_1.default)());
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
const user_2 = __importDefault(require("../Models/user"));
const User = user_2.default;
passport_1.default.use(User.createStrategy());
passport_1.default.serializeUser(User.serializeUser());
passport_1.default.deserializeUser(User.deserializeUser());
let jwtOptions = {};
jwtOptions["jwtFromRequest"] = ExtractJWT.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = DBConfig.Secret;
let strategy = new JWTStrategy(jwtOptions, (jwt_payload, done) => {
    User.findById(jwt_payload.id)
        .then((user) => {
        return done(null, user);
    })
        .catch((err) => {
        return done(err, false);
    });
});
app.use("/api/user", user_1.default);
app.use("/api/survey", survey_1.default);
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map