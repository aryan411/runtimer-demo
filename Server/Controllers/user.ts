import express from "express";
const router = express.Router();
import mongoose from 'mongoose';
import passport from 'passport';

import jwt from 'jsonwebtoken';
import * as DBConfig from '../Config/db';

import userModel from '../Models/user';
const User = userModel as mongoose.PassportLocalModel<any>; // alias

// * controller for processing Login page
export function processLoginPage(req:any,res:any, next:any) {
    passport.authenticate('local',
    (err, user, info) => {
        // server err?
        if(err)
        {
            return next(err);
        }
        //is there a user login error?
        if(!user)
        {
            return res.json({success: false, msg: 'Error: Failed to log in user!'});
        }

        req.login(user, (err:any) => {
            // server error?
            if(err)
            {
                return next(err);
            }

            const payload = 
            {
                id: user._id,
                displayName: user.displayName,
                username: user.username,
                email: user.email
            }

            const authToken = jwt.sign(payload, DBConfig.Secret, {
                expiresIn: 604800 // 1 week
            });
            
            return res.json({success: true, msg: 'User Logged in Successfully!', user: {
                id: user._id,
                displayName: user.displayName,
                username: user.username,
                email: user.email
            }, token: authToken});

        });
    })(req, res, next);
}



//* controller for processing registration page
export function processRegisterPage(req:any, res:any, next:any){
    // define a new user object
    let newUser = new User({
        username: req.body.username,
        //password: req.body.password
        email: req.body.email,
        displayName: req.body.displayName
    });

    User.register(newUser, req.body.password, (err:any) => {
        if (err) {
            if (err.name == "UserExistsError") {  
                //return res.json({success: false, msg: 'Username taken, please choose another username.'});
            }
            return res.json({success: false, msg: 'Error: failed to create user.'});
        } else {
        // if no error exists, then registration is successful
        return res.json({success: true, msg: 'User Registered Successfully!'});
        }
    });
};

//* controller for update user
export function processUpdateUser(req:any, res:any, next:any){
    const id = req.body.id;
    const newDisplayName = req.body.displayName;
    const newEmail = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const newPassword = req.body.newPassword;

    User.findByUsername(username,false).then((foundUser:any) => {
        if (foundUser){
            foundUser.changePassword(password, newPassword, (err:any) => {
                if (err) {
                    res.json({success: false, message: 'old password does not match.'});
                } else {
                    // if passwords match, update displayname and date updated
                    User.updateOne({_id: id}, {
                        displayName: newDisplayName,
                        email: newEmail,
                        update: Date.now()
                    }, (err:any) => {
                        // there should be no error since we searched for the user before
                    })
                    foundUser.save();
                    res.json({success: true, message: 'password reset successful.'});
                }
            });
        } else {
            res.status(500).json({success: false, message: 'This user does not exist'});
        }
    }, (err:any) => {
        console.error(err);
    })

}

//* controller for processing logout
export function performLogout(req:any, res:any, next:any){
    req.logout();
    res.json({success: true, msg: 'User Successfully Logged out!'});
};
