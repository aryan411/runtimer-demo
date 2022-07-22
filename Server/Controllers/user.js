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
exports.performLogout = exports.processUpdateUser = exports.processRegisterPage = exports.processLoginPage = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const DBConfig = __importStar(require("../Config/db"));
const user_1 = __importDefault(require("../Models/user"));
const User = user_1.default;
function processLoginPage(req, res, next) {
    passport_1.default.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.json({ success: false, msg: "Error: Failed to log in user!" });
        }
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            const payload = {
                id: user._id,
                displayName: user.displayName,
                username: user.username,
                email: user.email,
            };
            const authToken = jsonwebtoken_1.default.sign(payload, DBConfig.Secret, {
                expiresIn: 604800,
            });
            return res.json({
                success: true,
                msg: "User Logged in Successfully!",
                user: {
                    id: user._id,
                    displayName: user.displayName,
                    username: user.username,
                    email: user.email,
                },
                token: authToken,
            });
        });
    })(req, res, next);
}
exports.processLoginPage = processLoginPage;
function processRegisterPage(req, res, next) {
    let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        displayName: req.body.displayName,
    });
    User.register(newUser, req.body.password, (err) => {
        if (err) {
            if (err.name == "UserExistsError") {
            }
            return res.json({ success: false, msg: "Error: failed to create user." });
        }
        else {
            return res.json({ success: true, msg: "User Registered Successfully!" });
        }
    });
}
exports.processRegisterPage = processRegisterPage;
function processUpdateUser(req, res, next) {
    const id = req.body.id;
    const newDisplayName = req.body.displayName;
    const newEmail = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    User.findByUsername(username, false).then((foundUser) => {
        if (foundUser) {
            foundUser.changePassword(password, newPassword, (err) => {
                if (err) {
                    res.json({
                        success: false,
                        message: "old password does not match.",
                    });
                }
                else {
                    User.updateOne({ _id: id }, {
                        displayName: newDisplayName,
                        email: newEmail,
                        update: Date.now(),
                    }, (err) => {
                    });
                    foundUser.save();
                    res.json({ success: true, message: "password reset successful." });
                }
            });
        }
        else {
            res
                .status(500)
                .json({ success: false, message: "This user does not exist" });
        }
    }, (err) => {
        console.error(err);
    });
}
exports.processUpdateUser = processUpdateUser;
function performLogout(req, res, next) {
    req.logout(function (err) {
        if (err) {
            res.json({ success: false, msg: err });
        }
        res.json({ success: true, msg: "User Successfully Logged out!" });
    });
}
exports.performLogout = performLogout;
//# sourceMappingURL=user.js.map